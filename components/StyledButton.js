import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import Colors from '../constants/Colors';

const StyledButton = function(props) {
  const { onPress, style, labelStyle, label, rightIcon, leftIcon } = props;
  return (
    <TouchableOpacity style={{ ...styles.container, ...style }} onPress={onPress}>
      {rightIcon && rightIcon}
      {label && <Text style={{ ...styles.text, ...labelStyle }}>{label}</Text>}
      {leftIcon && leftIcon}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row' },
  text: {
    color: Colors.tintColor,
    paddingTop: 10,
    fontSize: 14,
    fontWeight: 'bold'
  }
});

StyledButton.defaultProps = {
  style: { flex: 1, backgroundColor: Colors.darkBackground },
  labelStyle: {}
};

StyledButton.propTypes = {
  onPress: PropTypes.func,
  style: PropTypes.object,
  labelStyle: PropTypes.object,
  label: PropTypes.string,
  rightIcon: PropTypes.element,
  leftIcon: PropTypes.element
};

export default StyledButton;
