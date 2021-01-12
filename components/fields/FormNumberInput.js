import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TextInput } from 'react-native';
import Styles from '../../constants/Styles';
import Separator from '../Separator';

export function FormNumberInput(props) {
  const { alias, isValid, editable, errorText, value, keyboardType, onChange } = props;
  return (
    <View>
      <Text style={Styles.header}>{alias}</Text>
      {!isValid && <Text style={{ color: '#ff0000' }}>{errorText}</Text>}
      <TextInput
        value={value}
        editable={editable}
        maxLength={40}
        onChangeText={value => {
          let num = value.replace(/[^0-9.]/g, '');
          if (num.startsWith('.')) {
            num = num.substr(1);
          }
          onChange(num);
        }}
      />
      <Separator />
    </View>
  );
}

FormNumberInput.defaultProps = {
  errorText: 'Error',
  keyboardType: 'default',
  editable: true
};

FormNumberInput.propTypes = {
  alias: PropTypes.string.isRequired,
  isValid: PropTypes.bool.isRequired,
  errorText: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  keyboardType: PropTypes.oneOf(['default', 'number-pad', 'decimal-pad', 'numeric', 'email-address', 'phone-pad']).isRequired,
  editable: PropTypes.bool
};

export default FormNumberInput;
