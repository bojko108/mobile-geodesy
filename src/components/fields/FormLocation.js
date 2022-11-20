import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import Styles from '../../constants/Styles';

export class FormLocation extends React.Component {
  state = { location: { coords: { latitude: 0, longitude: 0, accuracy: 1000 } }, errorText: null };
  unsubscribe = null;

  componentDidMount() {
    const { editable } = this.props;

    if (editable) {
      Location.requestForegroundPermissionsAsync().then(({ status }) => {
        if (status === 'granted') {
          const { accuracy, timeInterval, distanceInterval } = this.props;
          Location.watchPositionAsync({ accuracy, timeInterval, distanceInterval }, this.locationChanged).then((uns) => (this.unsubscribe = uns));
        } else {
          this.setState({ errorMessage: 'Permission to access location was denied!' });
        }
      });
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe.remove();
    }
  }

  locationChanged = (location) => {
    //console.info(`accuracy: ${location.coords.accuracy.toFixed(0)} m`);
    this.setState({ location });
    this.props.onChange(location);
  };

  render() {
    const { alias, editable, isValid, errorText } = this.props;
    const coords = this.state.location.coords;

    if (editable) {
      return (
        <View>
          <Text style={Styles.header}>{alias}</Text>
          {this.state.errorMessage ? <Text style={{ color: '#ff4136' }}>{this.state.errorMessage}</Text> : null}
          {!isValid ? <Text style={{ color: '#ff4136' }}>{errorText}</Text> : null}
          {!isValid ? <ActivityIndicator size='small' color='#ff4136' /> : null}
          <Text style={{ color: isValid ? '#111111' : '#ff4136' }}>{`${coords.latitude.toFixed(6)},${coords.longitude.toFixed(
            6
          )}; accuracy: ${coords.accuracy.toFixed(0)} m`}</Text>
        </View>
      );
    } else {
      return (
        <View>
          <Text style={Styles.header}>{alias}</Text>
          <Text>Not enabled in config</Text>
        </View>
      );
    }
  }
}

FormLocation.defaultProps = {
  errorText: 'Location Error',
  accuracy: 4,
  timeInterval: 30000,
  distanceInterval: 10,
  editable: true,
};

FormLocation.propTypes = {
  alias: PropTypes.string.isRequired,
  isValid: PropTypes.bool.isRequired,
  errorText: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  accuracy: PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
  timeInterval: PropTypes.number,
  distanceInterval: PropTypes.number,
  editable: PropTypes.bool,
};

export default FormLocation;
