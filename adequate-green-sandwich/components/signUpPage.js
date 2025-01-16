import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LoginPage = () => {
  const [firstName,setFirstName]=useState('');
  const [lastName,setLastName]=useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
   const navigation = useNavigation(); 

  const handleLogin = () => {
    // Add your login logic here
    Alert.alert('Login', `Email: ${email}\nPassword: ${password}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
         <TextInput 
      style={styles.input}
      placeholder="enter first name"
      value={firstName}
      onChangeText={setFirstName}
      keyboardType="firstName"
      autoCapitalize="none"
      />
         <TextInput 
      style={styles.input}
      placeholder="enter last name"
      value={lastName}
      onChangeText={setLastName}
      keyboardType="lastName"
      autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.footerText}>
          If you have an account? <Text style={styles.link}>Login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#666',
  },
});

export default LoginPage;