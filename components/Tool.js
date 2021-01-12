import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 5
  },
  image: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10
  }
});

export default function Tool({ icon, label }) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: icon }} style={styles.image} />
      <Text>{label}</Text>
    </View>
  );
}
