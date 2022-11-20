import React, { useEffect, useLayoutEffect, useState } from 'react';
import * as Location from 'expo-location';
import Constants from 'expo-constants';
import { Alert, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import MapView, { Polyline, UrlTile } from 'react-native-maps';
import Colors from '../constants/Colors';
import { createFeature, getCollectedFeatures, getSetting, mapStyle, removeCollectedFeature, setSetting, SETTINGS } from '../storage';
import { trace } from '../calculations';
import { FloatingAction } from 'react-native-floating-action';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useRecoilState, useResetRecoilState } from 'recoil';

import SelectBasemapModal from '../components/SelectBasemapModal';
import MapMarker from '../components/MapMarker';
import Layout from '../constants/Layout';
import UserLocationInfo from '../components/UserLocationInfo';
import Styles from '../constants/Styles';
import { getConfigFor } from '../collector/config';
import { getBasemaps } from '../storage/basemaps';
import { basemapState, featuresState, targetState, userLocationState } from '../store';

const MapScreen = (props) => {
  const [targetLocation, setTargetLocation] = useRecoilState(targetState);
  const [collectedFeatures, setFeatures] = useRecoilState(featuresState);
  const [userLocation, setUserLocation] = useRecoilState(userLocationState);
  const [basemap, setBasemap] = useRecoilState(basemapState);
  const resetTargetLocation = useResetRecoilState(targetState);

  const [basemaps, setBasemaps] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [showCollectedFeatures, setShowCollectedFeatures] = useState(true);
  const [showTraceInfo, setShowTraceInfo] = useState(true);
  const [errorMessage, setErrorMessage] = useState(undefined);

  let hasTraceInfo = false;
  let traceInfo = undefined;
  let unsubscribe = null;

  const componentDidMount = () => {
    const worker = async () => {
      let errorMessage;
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === 'granted') {
        unsubscribe = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.Highest, timeInterval: 3000, distanceInterval: 0 },
          _locationChanged
        );
      } else {
        errorMessage = 'Permission to access device location was denied!';
      }

      setErrorMessage(errorMessage);

      const basemap = await getSetting(SETTINGS.BASEMAP);
      setBasemap(basemap);
      const features = await getCollectedFeatures();
      setFeatures(features);
      const basemaps = getBasemaps();
      setBasemaps(basemaps);
    };

    worker().catch(console.error);

    return componentWillUnmount;
  };

  const componentWillUnmount = () => {
    if (unsubscribe) {
      unsubscribe.remove();
    }
  };

  const _locationChanged = (location) => {
    setUserLocation(location);
  };

  // onUserLocationChange = ({ nativeEvent }) => {
  //   const { targetLocation } = this.props;
  //   if (targetLocation) {
  //     this._calculateTraceInfo(nativeEvent.coordinate, targetLocation.geometry.coordinates.slice(0));
  //   }
  // };

  const onMapLongPress = ({ nativeEvent }) => {
    Alert.alert('Trace to this map location?', 'Any existing trace info will be lost!', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        onPress: async () => {
          const feature = await createFeature({}, nativeEvent.coordinate);
          setTargetLocation(feature);
        },
      },
    ]);
  };

  const onCollectedFeatureMarkerPress = (feature) => {
    let text = `featureType: ${feature.featureType}\nnumber: ${feature.number}`;
    text = `${text}\n${Object.keys(feature.properties)
      .map((key) => `${key}: ${feature.properties[key]}`)
      .join('\n')}`;

    Alert.alert('Info', text, [
      {
        text: 'Delete',
        onPress: async () => {
          const fid = feature.fid;
          await removeCollectedFeature(fid);
          setFeatures((oldFeatures) => oldFeatures.filter((f) => f.id !== fid));
        },
      },
      {
        text: 'Trace To',
        onPress: () => {
          setTargetLocation(feature.geometry);
        },
      },
      { text: 'Close', style: 'cancel' },
    ]);
  };

  const onInformationPress = async () => {
    _handleActionPress('bt_info');
  };
  const onSettingsPress = async () => {
    _handleActionPress('bt_settings');
  };

  const _handleActionPress = async (name) => {
    switch (name) {
      case 'bt_trace_point':
        props.navigation.navigate('TracePoint');
        break;
      case 'bt_show_trace_info':
        setShowTraceInfo(!showTraceInfo);
        break;
      case 'bt_clear_trace':
        resetTargetLocation();
        break;
      case 'bt_showhide_collected_features':
        setShowCollectedFeatures(!showCollectedFeatures);
        break;
      case 'bt_collect_feature':
        props.navigation.navigate('CreateFeature');
        break;
      case 'bt_manage_collected_features':
        props.navigation.navigate('CollectedFeatures');
        break;
      case 'bt_change_basemap':
        setModalVisible(true);
        break;
      case 'bt_info':
        props.navigation.navigate('Information');
        break;
      case 'bt_settings':
        props.navigation.navigate('Settings');
        break;
    }
  };

  const actions = [
    {
      text: 'Trace Point',
      icon: <Icon name='map-marker-distance' size={24} color={Colors.tintColor} />,
      color: Colors.darkBackground,
      name: 'bt_trace_point',
      position: 1,
    },
    {
      text: 'Show Trace Info',
      icon: <Icon name={showTraceInfo ? 'checkbox-outline' : 'checkbox-blank-outline'} size={24} color={Colors.tintColor} />,
      color: Colors.darkBackground,
      name: 'bt_show_trace_info',
      position: 1,
    },
    {
      text: 'Clear Trace',
      icon: <Icon name='flag-remove' size={24} color={Colors.tintColor} />,
      color: Colors.darkBackground,
      name: 'bt_clear_trace',
      position: 1,
    },
    {
      text: 'Show Collected Features',
      icon: <Icon name={showCollectedFeatures ? 'checkbox-outline' : 'checkbox-blank-outline'} size={24} color={Colors.tintColor} />,
      color: Colors.darkBackground,
      name: 'bt_showhide_collected_features',
      position: 1,
    },
    {
      text: 'Collect New Feature',
      icon: <Icon name='calendar-plus' size={24} color={Colors.tintColor} />,
      color: Colors.darkBackground,
      name: 'bt_collect_feature',
      position: 1,
    },
    {
      text: 'Manage Collected Features',
      icon: <Icon name='calendar-edit' size={24} color={Colors.tintColor} />,
      color: Colors.darkBackground,
      name: 'bt_manage_collected_features',
      position: 1,
    },
    {
      text: 'Change Basemap',
      icon: <Icon name='layers' size={24} color={Colors.tintColor} />,
      color: Colors.darkBackground,
      name: 'bt_change_basemap',
      position: 1,
    },
    // {
    //   text: 'Settings',
    //   icon: <Icon name='cog' size={24} color={Colors.tintColor} />,
    //   color: Colors.darkBackground,
    //   name: 'bt_settings',
    //   position: 1,
    // },
  ];

  const onBasemapSelected = (url) => {
    setModalVisible(false);
    if (url) {
      setBasemap(url);
      setSetting(SETTINGS.BASEMAP, url);
    }
  };

  useEffect(componentDidMount, []);
  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerTitle: Constants.manifest.name,
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={onInformationPress}>
            <Icon name='robot-confused-outline' style={{ paddingHorizontal: 10 }} size={32} color={Colors.tintColor} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onSettingsPress}>
            <Icon name='cog' size={32} color={Colors.tintColor} />
          </TouchableOpacity>
        </View>
      ),
    });
  });

  let mapType = 'none',
    customTileUrl = null;

  if (basemap) {
    if (basemap.startsWith('mapType:')) {
      mapType = basemap.replace('mapType:', '');
      customTileUrl = null;
    } else {
      mapType = 'none';
      customTileUrl = basemap;
    }
  }

  if (targetLocation) {
    const { latitude, longitude } = targetLocation.geometry;
    traceInfo = trace(userLocation.coords, [latitude, longitude]);
    hasTraceInfo = !!traceInfo;
  }

  return (
    <View style={Styles.container}>
      <SelectBasemapModal visible={modalVisible} selected={basemap} basemaps={basemaps} onBasemapSelected={onBasemapSelected} />
      <MapView
        style={{ flex: 1 }}
        mapType={mapType}
        customMapStyle={mapStyle}
        showsUserLocation={errorMessage === undefined}
        showsMyLocationButton={errorMessage === undefined}
        showsBuildings={false}
        showsTraffic={false}
        showsCompass={true}
        showsIndoors={false}
        showsIndoorLevelPicker={false}
        // onUserLocationChange={onUserLocationChange}
        onLongPress={onMapLongPress}
        initialRegion={{
          latitude: 42.692273,
          longitude: 23.32091,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {targetLocation ? (
          <MapMarker feature={targetLocation} icon='flag' anchor={{ x: 0.25, y: 0.85 }} size={32} color={Colors.darkBackground} />
        ) : null}
        {hasTraceInfo && userLocation ? (
          <Polyline
            coordinates={[
              { latitude: userLocation.coords.latitude, longitude: userLocation.coords.longitude },
              { latitude: targetLocation.geometry.latitude, longitude: targetLocation.geometry.longitude },
            ]}
            strokeColor={Colors.orange}
            strokeWidth={4}
          />
        ) : null}
        {showCollectedFeatures
          ? collectedFeatures.map((feature) => {
              const config = getConfigFor(feature.featureType);
              return (
                <MapMarker
                  key={feature.fid}
                  feature={feature}
                  showLabel={true}
                  icon={config.map.marker}
                  anchor={config.map.anchor}
                  size={32}
                  color={config.map.color}
                  onPress={() => {
                    onCollectedFeatureMarkerPress(feature);
                  }}
                />
              );
            })
          : null}

        {customTileUrl ? <UrlTile urlTemplate={customTileUrl} /> : null}
      </MapView>
      {showTraceInfo && hasTraceInfo ? (
        <View style={styles.infoContainer}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 12, fontWeight: 'bold' }}>Target info:</Text>
            <Text style={{ fontSize: 12 }}>{`dX: ${traceInfo.dx.toFixed()} m
dY: ${traceInfo.dy.toFixed()} m
Distance: ${traceInfo.distance.toFixed()} m
Direction: ${traceInfo.direction.toFixed()} deg`}</Text>
          </View>
        </View>
      ) : null}

      {userLocation ? (
        <View style={styles.userLocationContainer}>
          <UserLocationInfo userLocation={userLocation} textColor={Colors.background} backgroundColor={Colors.tintColor} />
        </View>
      ) : null}

      <FloatingAction
        actions={actions}
        color={Colors.background}
        distanceToEdge={{ vertical: 30, horizontal: 10 }}
        actionsPaddingTopBottom={2}
        floatingIcon={<Icon name='toolbox' size={24} color={Colors.tintColor} />}
        onPressItem={_handleActionPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  userLocationContainer: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    width: Layout.window.width,
    height: 20,
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 1.0)',
    bottom: 19,
    left: 0,
    width: Layout.window.width,
    padding: 5,
  },
});

export default MapScreen;
