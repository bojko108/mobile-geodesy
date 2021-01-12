import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';

import Styles from '../../constants/Styles';
import Separator from '../Separator';
import Dropdown from '../Dropdown';

export function FormDropdown(props) {
  const { alias, editable, isValid, errorText, value, onChange, items, multiple = false } = props;
  return (
    <View>
      <Text style={Styles.header}>{alias}</Text>
      {!isValid && <Text style={{ color: '#ff4136' }}>{errorText}</Text>}
      <Dropdown
        enabled={editable}
        selectedValue={value}
        items={items.map(({ label, code }) => ({ label, value: code || label }))}
        onValueSelected={onChange}
      />
    </View>
  );
}

FormDropdown.defaultProps = {
  errorText: 'Error',
  items: [],
  editable: true
};

FormDropdown.propTypes = {
  alias: PropTypes.string.isRequired,
  isValid: PropTypes.bool.isRequired,
  errorText: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string.isRequired, code: PropTypes.any })).isRequired,
  multiple: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  editable: PropTypes.bool
};

export default FormDropdown;
