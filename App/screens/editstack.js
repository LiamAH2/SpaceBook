import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Edit from './edit';
import UpdatePhoto from './updatephoto';

const Stack = createNativeStackNavigator();

function EditStack() {
  return (
      <Stack.Navigator>
        <Stack.Screen name="Edit" component={Edit} />
        <Stack.Screen name="UpdatePhoto" component={UpdatePhoto} />
        
      </Stack.Navigator>
  );
}

export default EditStack;