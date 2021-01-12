import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import MapScreen from '../screens/MapScreen';
import TracePointScreen from '../screens/TracePointScreen';
import CollectedFeaturesScreen from '../screens/CollectedFeaturesScreen';
import CreateFeatureScreen from '../screens/CreateFeatureScreen';
import ExportScreen from '../screens/ExportScreen';
import SettingsScreen from '../screens/SettingsScreen';

import { CenteredText } from '../components/StyledText';
import TabBarIcon from '../components/TabBarIcon';
import Colors from '../constants/Colors';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {}
});

const MainStack = createStackNavigator(
  {
    Map: MapScreen,
    TracePoint: TracePointScreen,
    CollectedFeatures: CollectedFeaturesScreen,
    CreateFeature: CreateFeatureScreen,
    Export: ExportScreen,
    Settings: SettingsScreen
  },
  config
);

MainStack.navigationOptions = {
  tabBarLabel: ({ focused }) => (
    <CenteredText style={{ fontSize: 12, color: focused ? Colors.darkBackground : Colors.tabIconDefault }}>Map</CenteredText>
  ),
  tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name={'md-map'} />
};

MainStack.path = '';

export default MainStack;
