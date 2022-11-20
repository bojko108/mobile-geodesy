import AppLoading from 'expo-app-loading';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { RecoilRoot } from 'recoil';

import { checkSettingsInStorage } from './src/storage';
import { fetchLocalTilesetsAsync } from './src/storage/basemaps';
import { fetchFeatureTemplatesAsync } from './src/collector/config';

import Styles from './src/constants/Styles';
import StackNavigation from './src/navigation';

export default class App extends React.Component {
  state = {
    appReady: false,
  };

  async componentDidMount() {
    // Prevent native splash screen from autohiding
    try {
      await SplashScreen.preventAutoHideAsync();
    } catch (e) {
      console.warn(e);
    }
    this.prepareResources();
  }

  prepareResources = async () => {
    try {
      await this.loadResourcesAsync();
    } catch (e) {
      console.warn(e);
    } finally {
      this.setState({ appReady: true }, async () => {
        await SplashScreen.hideAsync();
      });
    }
  };

  loadResourcesAsync = async () => {
    Font.loadAsync({
      ...Ionicons.font,
      'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
    });

    await checkSettingsInStorage();
    await fetchLocalTilesetsAsync();
    await fetchFeatureTemplatesAsync();
  };

  render() {
    if (!this.state.appReady) return <AppLoading />;

    return (
      <SafeAreaProvider>
        <RecoilRoot>
          <View style={Styles.container}>
            <StatusBar style='light' />
            <StackNavigation />
          </View>
        </RecoilRoot>
      </SafeAreaProvider>
    );
  }
}
