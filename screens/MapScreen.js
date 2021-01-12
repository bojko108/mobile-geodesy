import React from 'react';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { Alert, View, StyleSheet, Text } from 'react-native';
import MapView, { Polyline, UrlTile } from 'react-native-maps';
import Colors from '../constants/Colors';
import { mapStyle } from '../storage';
import { trace } from '../calculations';
import { FloatingAction } from 'react-native-floating-action';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions } from '../store/actions';
import SelectBasemapModal from '../components/SelectBasemapModal';
import MapMarker from '../components/MapMarker';
import Layout from '../constants/Layout';
import UserLocationInfo from '../components/UserLocationInfo';
import Styles from '../constants/Styles';
import { getConfigFor } from '../collector/config';
import { getBasemaps } from '../storage/basemaps';

class MapScreen extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      basemaps: [],
      modalVisible: false,
      showCollectedFeatures: true,
      showTraceInfo: true,
      userLocation: undefined,
      hasTraceInfo: false,
      traceInfo: {},
      errorMessage: undefined,
    };

    console.log('map view created');
  }

  unsubscribe = null;
  onFocusListener = null;

  async componentDidMount() {
    let errorMessage;
    const { status } = await Permissions.askAsync(Permissions.LOCATION);

    if (status === 'granted') {
      this.unsubscribe = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Highest, timeInterval: 3000, distanceInterval: 0 },
        this._locationChanged
      );
    } else {
      errorMessage = 'Permission to access device location was denied!';
    }

    this.onFocusListener = this.props.navigation.addListener('didFocus', async (payload) => {
      // const basemap = await getSetting(SETTINGS.BASEMAP);
      // this.setState({ basemap });
    });

    // const basemap = await getSetting(SETTINGS.BASEMAP);
    const basemaps = getBasemaps();
    this.setState({ basemaps, errorMessage });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe.remove();
    }
  }

  _locationChanged = ({ coords }) => {
    const { targetLocation } = this.props;
    if (targetLocation) {
      const { latitude, longitude } = targetLocation.geometry;
      this._calculateTraceInfo(coords, [latitude, longitude]);
    } else {
      this.setState({ userLocation: coords });
    }
  };

  // onUserLocationChange = ({ nativeEvent }) => {
  //   const { targetLocation } = this.props;
  //   if (targetLocation) {
  //     this._calculateTraceInfo(nativeEvent.coordinate, targetLocation.geometry.coordinates.slice(0));
  //   }
  // };

  onMapLongPress = ({ nativeEvent }) => {
    Alert.alert('Trace to this map location?', 'Any existing trace info will be lost!', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        onPress: () => {
          this.props.actions.traceFeature(nativeEvent.coordinate);
        },
      },
    ]);
  };

  onCollectedFeatureMarkerPress = (feature) => {
    let text = `featureType: ${feature.featureType}\nnumber: ${feature.number}`;
    text = `${text}\n${Object.keys(feature.properties)
      .map((key) => `${key}: ${feature.properties[key]}`)
      .join('\n')}`;

    Alert.alert('Info', text, [
      {
        text: 'Delete',
        onPress: () => {
          this.props.actions.removeFeature(feature.fid);
        },
      },
      {
        text: 'Trace To',
        onPress: () => {
          this.props.actions.traceFeature(feature.geometry);
        },
      },
      { text: 'Close', style: 'cancel' },
    ]);
  };

  _calculateTraceInfo = (userLocation, targetLocation) => {
    const traceInfo = trace(userLocation, targetLocation);
    const hasTraceInfo = !!traceInfo;
    this.setState({ userLocation, traceInfo, hasTraceInfo });
  };

  _handleActionPress = async (name) => {
    switch (name) {
      case 'bt_trace_point':
        this.props.navigation.navigate('TracePoint');
        break;
      case 'bt_show_trace_info':
        this.setState({ showTraceInfo: !this.state.showTraceInfo });
        break;
      case 'bt_clear_trace':
        this.props.actions.clearTrace();
        this.setState({ hasTraceInfo: false, traceInfo: {} });
        break;
      case 'bt_showhide_collected_features':
        this.setState({ showCollectedFeatures: !this.state.showCollectedFeatures });
        break;
      case 'bt_collect_feature':
        this.props.navigation.navigate('CreateFeature');
        break;
      case 'bt_manage_collected_features':
        this.props.navigation.navigate('CollectedFeatures');
        break;
      case 'bt_change_basemap':
        this.setState({ modalVisible: true });
        break;
      case 'bt_settings':
        this.props.navigation.navigate('Settings');
        break;
    }
  };

  onBasemapSelected = (url) => {
    this.setState({ modalVisible: false });

    if (url) {
      this.props.actions.changeBasemap(url);
    }
  };

  render() {
    const { targetLocation, collectedFeatures, basemap } = this.props;
    const { basemaps, modalVisible, userLocation, hasTraceInfo, showCollectedFeatures, showTraceInfo, traceInfo, errorMessage } = this.state;
    const { dx, dy, distance, direction } = traceInfo;

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
        icon: <Icon name={showTraceInfo ? 'check-box-outline' : 'checkbox-blank-outline'} size={24} color={Colors.tintColor} />,
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
        icon: <Icon name={showCollectedFeatures ? 'check-box-outline' : 'checkbox-blank-outline'} size={24} color={Colors.tintColor} />,
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
      {
        text: 'Settings',
        icon: <Icon name='settings' size={24} color={Colors.tintColor} />,
        color: Colors.darkBackground,
        name: 'bt_settings',
        position: 1,
      },
    ];

    return (
      <View style={Styles.container}>
        <SelectBasemapModal visible={modalVisible} selected={basemap} basemaps={basemaps} onBasemapSelected={this.onBasemapSelected} />
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
          // onUserLocationChange={this.onUserLocationChange}
          onLongPress={this.onMapLongPress}
          initialRegion={{
            latitude: 42.692273,
            longitude: 23.32091,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {targetLocation && <MapMarker feature={targetLocation} icon='flag' anchor={{ x: 0.25, y: 0.85 }} size={32} color={Colors.darkBackground} />}
          {hasTraceInfo && userLocation && (
            <Polyline
              coordinates={[
                { latitude: userLocation.latitude, longitude: userLocation.longitude },
                { latitude: targetLocation.geometry.latitude, longitude: targetLocation.geometry.longitude },
              ]}
              strokeColor={Colors.orange}
              strokeWidth={4}
            />
          )}
          {showCollectedFeatures &&
            collectedFeatures.map((feature) => {
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
                    this.onCollectedFeatureMarkerPress(feature);
                  }}
                />
              );
            })}

          {customTileUrl && <UrlTile urlTemplate={customTileUrl} />}
        </MapView>
        {showTraceInfo && hasTraceInfo && (
          <View style={styles.infoContainer}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold' }}>Target info:</Text>
              <Text style={{ fontSize: 12 }}>{`dX: ${dx.toFixed()} m
dY: ${dy.toFixed()} m
Distance: ${distance.toFixed()} m
Direction: ${direction.toFixed()} deg`}</Text>
            </View>
          </View>
        )}

        {userLocation && (
          <View style={styles.userLocationContainer}>
            <UserLocationInfo userLocation={userLocation} textColor={Colors.background} backgroundColor={Colors.tintColor} />
          </View>
        )}

        <FloatingAction
          actions={actions}
          color={Colors.background}
          distanceToEdge={{ vertical: 30, horizontal: 10 }}
          actionsPaddingTopBottom={2}
          floatingIcon={<Icon name='toolbox' size={24} color={Colors.tintColor} />}
          onPressItem={this._handleActionPress}
        />
      </View>
    );
  }
}

MapScreen.navigationOptions = {
  //header: null
  title: Constants.manifest.name,
  headerStyle: {
    backgroundColor: Colors.background,
  },
  headerTintColor: Colors.tintColor,
  headerTitleStyle: {
    fontWeight: 'bold',
  },
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

const mapStateToProps = (store, ownProps) => {
  const { targetLocation, collectedFeatures, basemap } = store;
  console.log('in map: ' + basemap);
  return { targetLocation, collectedFeatures, basemap };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);
