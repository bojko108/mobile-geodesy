import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Constants from 'expo-constants';
import Colors from '../constants/Colors';

import MapScreen from '../screens/MapScreen';
import TracePointScreen from '../screens/TracePointScreen';
import CollectedFeaturesScreen from '../screens/CollectedFeaturesScreen';
import CreateFeatureScreen from '../screens/CreateFeatureScreen';
import ExportScreen from '../screens/ExportScreen';
import InformationScreen from '../screens/InformationScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();

export default () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='Map'
        screenOptions={{
          title: Constants.manifest.name,
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTintColor: Colors.tintColor,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name='Map' component={MapScreen} />
        <Stack.Screen name='TracePoint' component={TracePointScreen} />
        <Stack.Screen name='CollectedFeatures' component={CollectedFeaturesScreen} />
        <Stack.Screen name='CreateFeature' component={CreateFeatureScreen} />
        <Stack.Screen name='Export' component={ExportScreen} />
        <Stack.Screen name='Information' component={InformationScreen} />
        <Stack.Screen name='Settings' component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
