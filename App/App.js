import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/Stack';

import HomeScreen from './screens/home';
import LoginScreen from './screens/login';
import SignupScreen from './screens/signup';
import LogoutScreen from './screens/logout';

// Stacks
import EditStack from './screens/editstack';
import FriendStack from './screens/friendstack';
import PostStack from './screens/poststack';

const Stack = createStackNavigator();

class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Posts" component={PostStack} />
          <Stack.Screen name="Edit" component={EditStack} />
          <Stack.Screen name="Friends" component={FriendStack} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Logout" component={LogoutScreen} />
        </Stack.Navigator>

      </NavigationContainer>
    );
  }
}

export default App;
