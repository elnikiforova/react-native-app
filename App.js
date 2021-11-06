import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Camera from './components/Camera';
import SetFilters from './components/SetFilters';

const Stack = createNativeStackNavigator();

function App() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Camera" component={Camera} />
          <Stack.Screen name="Filters" component={SetFilters} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

export default App;