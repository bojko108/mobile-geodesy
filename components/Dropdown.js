import React from 'react';
import PropTypes from 'prop-types';
import { View, Picker } from 'react-native';
import Separator from './Separator';

const Dropdown = function(props) {
  const { selectedValue, items, onValueSelected, enabled, addNoItemSelected, noItemSelectedLabel, noItemSelectedValue } = props;

  if (addNoItemSelected) {
    items.unshift({ label: noItemSelectedLabel, value: noItemSelectedValue });
  }

  return (
    <View>
      <Picker
        enabled={enabled}
        selectedValue={selectedValue}
        onValueChange={selectedValue => {
          onValueSelected(selectedValue);
        }}
      >
        {items.map((item, index) => (
          <Picker.Item key={index} label={item.label} value={item.value} />
        ))}
      </Picker>
      <Separator />
    </View>
  );
};

Dropdown.defaultProps = {
  items: [],
  enabled: true,
  addNoItemSelected: false,
  noItemSelectedLabel: 'Select...',
  noItemSelectedValue: undefined
};

Dropdown.propTypes = {
  selectedValue: PropTypes.any,
  items: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string.isRequired, value: PropTypes.any })),
  onValueSelected: PropTypes.func,
  enabled: PropTypes.bool,
  addNoItemSelected: PropTypes.bool,
  noItemSelectedLabel: PropTypes.string,
  noItemSelectedValue: PropTypes.any
};

export default Dropdown;
