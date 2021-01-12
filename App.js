import { AppLoading, SplashScreen } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import AppNavigator from './navigation/AppNavigator';
import { checkSettingsInStore, getSetting, SETTINGS } from './storage';

import configureStore from './store/configureStore';
import { Provider } from 'react-redux';
import { getFeatures, changeBasemap } from './store/actions/actions';

import { fetchLocalTilesetsAsync } from './storage/basemaps';
import { fetchFeatureTemplatesAsync } from './collector/config';

const store = configureStore();
store.dispatch(getFeatures());

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return <AppLoading startAsync={loadResourcesAsync} onError={handleLoadingError} onFinish={() => handleFinishLoading(setLoadingComplete)} />;
  } else {
    SplashScreen.hide();
    return (
      <Provider store={store}>
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle='default' />}
          <AppNavigator />
        </View>
      </Provider>
    );
  }
}

async function loadResourcesAsync() {
  await Promise.all([
    Asset.loadAsync([require('./assets/images/robot-dev.png'), require('./assets/images/robot-prod.png')]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free to
      // remove this if you are not using it in your app
      'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
    }),

    checkSettingsInStore(),
    fetchLocalTilesetsAsync(),
    fetchFeatureTemplatesAsync(),
    store.dispatch(changeBasemap(await getSetting(SETTINGS.BASEMAP))),
  ]);
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
