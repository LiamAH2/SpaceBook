import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Friends from './friends';

const Stack = createNativeStackNavigator();

function FriendStack() {
  return (
      <Stack.Navigator>
       <Stack.Screen name="Friends" component={Friends} />
      </Stack.Navigator>
  );
}

export default FriendStack;