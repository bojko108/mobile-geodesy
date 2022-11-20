import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';

class Separator extends React.Component {
  render() {
    const { marginHorizontal, marginVertical, marginTop, marginBottom, color, width } = this.props;
    return <View style={{ marginHorizontal, marginVertical, marginTop, marginBottom, borderBottomColor: color, borderBottomWidth: width }} />;
  }
}

Separator.defaultProps = {
  color: '#737373',
  width: StyleSheet.hairlineWidth,
  marginTop: 0,
  marginBottom: 0,
  marginHorizontal: 0,
  marginVertical: 0
};

Separator.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  marginTop: PropTypes.number,
  marginBottom: PropTypes.number,
  marginHorizontal: PropTypes.number,
  marginVertical: PropTypes.number
};

export default Separator;
