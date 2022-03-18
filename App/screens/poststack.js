/* eslint-disable react/jsx-filename-extension */
import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Posts from './posts';

const Stack = createNativeStackNavigator();

function FriendStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Posts" component={Posts} />
    </Stack.Navigator>
  );
}

export default FriendStack;
