import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from './components/loginPage';
import SignUpPage from './components/signUpPage';
import Dashboard  from './components/Dashboard'

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Sign Up" component={SignUpPage} />
        <Stack.Screen name="Dashboard" component={Dashboard}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;