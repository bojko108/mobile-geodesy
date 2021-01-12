import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import Styles from '../../constants/Styles';

export class FormCamera extends React.Component {
  state = { hasCameraPermission: false };

  componentDidMount() {
    Permissions.askAsync(Permissions.CAMERA).then(({ status }) => {
      this.setState({ hasCameraPermission: status === 'granted' });
    });
  }

  render() {
    const { alias, isValid, errorText } = this.props;
    return (
      <View>
        <Text style={Styles.header}>{alias}</Text>
        {!isValid && <Text style={{ color: '#ff4136' }}>{errorText}</Text>}
        <Button title='Take photo' onPress={this.takePhoto} />
      </View>
    );
  }
}

FormCamera.propTypes = {
  alias: PropTypes.string.isRequired,
  isValid: PropTypes.bool.isRequired,
  errorText: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default FormCamera;
