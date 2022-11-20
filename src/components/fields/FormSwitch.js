import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Switch } from 'react-native';
import Styles from '../../constants/Styles';

export function FormSwitch(props) {
  const { alias, editable, isValid, errorText, value, onChange } = props;
  return (
    <View>
      <Text style={Styles.header}>{alias}</Text>
      {!isValid ? <Text style={{ color: '#ff0000' }}>{errorText}</Text> : null}
      <Switch value={value} editable={editable} maxLength={40} onValueChange={onChange} />
    </View>
  );
}

FormSwitch.defaultProps = {
  errorText: 'Error',
  editable: true,
};

FormSwitch.propTypes = {
  alias: PropTypes.string.isRequired,
  isValid: PropTypes.bool.isRequired,
  errorText: PropTypes.string,
  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  editable: PropTypes.bool,
};

export default FormSwitch;
