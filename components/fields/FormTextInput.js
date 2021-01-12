import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TextInput } from 'react-native';
import FormMaskInput from './FormMaskInput';
import Styles from '../../constants/Styles';
import Separator from '../Separator';

export function FormTextInput(props) {
  const { alias, maxLength, editable, isValid, errorText, value, keyboardType, mask, delimiter, onChange } = props;
  return (
    <View>
      <Text style={Styles.header}>{alias}</Text>
      {!isValid && <Text style={{ color: '#ff0000' }}>{errorText}</Text>}
      {mask ? (
        <FormMaskInput mask={mask} delimiter={delimiter} value={value} isValid={isValid} onChange={onChange} />
      ) : (
        <TextInput value={value.toString()} keyboardType={keyboardType} editable={editable} maxLength={maxLength} onChangeText={onChange} />
      )}
      <Separator />
    </View>
  );
}

//     <TextInput value={value} editable maxLength={maxLength} onChangeText={onChange} />

FormTextInput.defaultProps = {
  errorText: 'Error',
  keyboardType: 'default',
  editable: true
};

FormTextInput.propTypes = {
  alias: PropTypes.string.isRequired,
  maxLength: PropTypes.number,
  isValid: PropTypes.bool.isRequired,
  errorText: PropTypes.string,
  value: PropTypes.string.isRequired,
  mask: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  editable: PropTypes.bool
};

export default FormTextInput;
