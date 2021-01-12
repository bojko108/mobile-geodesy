import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function UserLocationInfo(props) {
  const { backgroundColor, textColor, userLocation } = props;
  const { latitude, longitude, altitude, accuracy } = userLocation;
  const locationText = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}, ${altitude.toFixed()} m`;
  const accuracyText = `${accuracy.toFixed()} meters`;
  return (
    <View style={{ ...styles.container, backgroundColor }}>
      <View style={{ flex: 2, flexDirection: 'row' }}>
        <Icon style={{ flex: 1 }} name='map-marker-radius' size={18} color={textColor} />
        <Text style={{ ...styles.text, flex: 5, color: textColor }}>{locationText}</Text>
      </View>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <Icon style={{ flex: 1 }} name='plus-minus-box' size={18} color={textColor} />
        <Text style={{ ...styles.text, flex: 5, color: textColor }}>{accuracyText}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  text: {
    fontSize: 12,
    fontWeight: 'bold'
  }
});
