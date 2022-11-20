import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Marker } from 'react-native-maps';

class MapMarker extends React.Component {
  state = {
    tracksViewChanges: false,
  };

  componentDidUpdate(prevProps) {
    if (prevProps.feature.geometry !== this.props.feature.geometry) {
      this.setState({ tracksViewChanges: true });
    } else if (this.state.tracksViewChanges) {
      // set to false immediately after rendering with tracksViewChanges is true
      this.setState({ tracksViewChanges: false });
    }
  }

  render() {
    const { tracksViewChanges } = this.state;
    const { feature, showLabel, icon, size, color, anchor, onPress } = this.props;
    const { longitude, latitude } = feature.geometry;
    return (
      <Marker anchor={anchor} coordinate={{ latitude, longitude }} tracksViewChanges={tracksViewChanges} onPress={onPress}>
        <View style={{ flexDirection: 'row' }}>
          <Icon name={icon} size={size} color={color} />
          {showLabel ? <Text>{feature.number}</Text> : null}
        </View>
      </Marker>
    );
  }
}

MapMarker.defaultProps = {
  showLabel: false,
};

MapMarker.propTypes = {
  feature: PropTypes.object.isRequired,
  showLabel: PropTypes.bool,
  icon: PropTypes.string.isRequired,
  size: PropTypes.number,
  color: PropTypes.string | PropTypes.number,
  anchor: PropTypes.exact({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  onPress: PropTypes.func,
};

export default MapMarker;
