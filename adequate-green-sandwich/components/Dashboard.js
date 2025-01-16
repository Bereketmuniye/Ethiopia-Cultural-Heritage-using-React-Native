import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native';
import HTMLParser from 'react-native-html-parser';
import { Share } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const EthiopiaWorldHeritage = () => {
  const [heritageSites, setHeritageSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState({});
  const [dislikes, setDislikes] = useState({});
  const [expanded, setExpanded] = useState({});
  const rotateAnim = useRef(new Animated.Value(0)).current; // Initial value for rotation

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://www.ethiopianadventuretours.com/about-ethiopia/unesco-world-heritage-sites-ethiopia'
        );
        const text = await response.text();

        const parser = new HTMLParser.DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const siteContainers = doc.getElementsByClassName('col-sm-12');

        const sites = Array.from(siteContainers)
          .filter((_, index, array) => index > 1 && index < array.length - 2)
          .map((container) => {
            const titleElement = container.getElementsByTagName('h3')[0];
            const descriptionElement = container.getElementsByTagName('p')[0];
            const imgElement = container.getElementsByTagName('img')[0];

            const title = titleElement
              ? titleElement.textContent.trim()
              : 'No title available';
            const image = imgElement
              ? `https://www.ethiopianadventuretours.com${imgElement.getAttribute('src')}`
              : '';
            const description = descriptionElement
              ? descriptionElement.textContent.trim()
              : 'No description available';

            return { title, description, image };
          });

        setHeritageSites(sites);
      } catch (err) {
        setError(err);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const shareSite = async (site) => {
    const url = `https://www.ethiopianadventuretours.com/about-ethiopia/unesco-world-heritage-sites-ethiopia#${encodeURIComponent(site.title)}`; 
    const message = `${url} \n\n ${site.image}`;

    try {
      await Share.share({
        message: message,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleIconPress = (title, isFavorite) => {
    const newFavorites = {
      ...favorites,
      [title]: !isFavorite,
    };
    setFavorites(newFavorites);
    animateIcon();
  };

  const handleDislikePress = (title, isDisliked) => {
    const newDislikes = {
      ...dislikes,
      [title]: !isDisliked,
    };
    setDislikes(newDislikes);
    animateIcon();
  };

  const animateIcon = () => {
    rotateAnim.setValue(0); 
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      rotateAnim.setValue(0); 
    });
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '20deg'], // Rotate to the right
  });

  const toggleExpand = (title) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [title]: !prevExpanded[title],
    }));
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>Error fetching data: {error.message}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Ethiopia - UNESCO World Heritage</Text>
      {heritageSites.length > 0 ? (
        heritageSites.map((site, index) => (
          <View key={index} style={styles.siteContainer}>
            <Text style={styles.siteTitle}>{site.title}</Text>
            <View style={styles.contentContainer}>
              {site.image && (
                <Image source={{ uri: site.image }} style={styles.image} />
              )}
              <View style={styles.descriptionContainer}>
                <Text style={styles.description}>
                  {expanded[site.title]
                    ? site.description
                    : `${site.description.substring(0, 100)}...`}
                </Text>
                <TouchableOpacity onPress={() => toggleExpand(site.title)} style={styles.readMoreButton}>
                  <Text style={styles.readMoreText}>
                    {expanded[site.title] ? 'Read Less' : 'Read More'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.iconContainer}>
                <TouchableOpacity onPress={() => handleIconPress(site.title, favorites[site.title])} style={styles.iconButton}>
                    <Icon
                      name="favorite"
                      size={24}
                      color={favorites[site.title] ? 'red' : 'gray'}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDislikePress(site.title, dislikes[site.title])} style={styles.iconButton}>
                  <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
                    <Icon 
                      name="thumb-down" 
                      size={24} 
                      color={dislikes[site.title] ? '#007BFF' : 'gray'} 
                    />
                  </Animated.View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => shareSite(site)} style={styles.iconButton}>
                  <Icon name="share" size={24} color="#007BFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))
      ) : (
        <Text>No heritage sites found. Please check the data structure.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  siteContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  siteTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  contentContainer: {
    flexDirection: 'column', 
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 5,
    marginBottom: 10,
  },
  descriptionContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  description: {
    marginBottom: 10,
    textAlign: 'justify',
  },
  readMoreButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  readMoreText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  iconContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-around',
    width: '100%', 
    marginTop: 10,
  },
  iconButton: {
    padding: 10,
  },
});

const Dashboard = () => {
  return (
    <View style={{ flex: 1 }}>
      <EthiopiaWorldHeritage />
    </View>
  );
};

export default Dashboard;