import React from 'react';
import Constants from 'expo-constants';
import { StyleSheet, Image, Text, View } from 'react-native';
import Colors from '../constants/Colors';

export const ListHeader = () => {
  const { manifest } = Constants;

  return (
    <View style={styles.titleContainer}>
      <View style={styles.titleIconContainer}>
        <AppIconPreview iconUrl={manifest.iconUrl} />
      </View>

      <View style={styles.titleTextContainer}>
        <Text style={styles.nameText} numberOfLines={1}>
          {manifest.name}
        </Text>

        <Text style={styles.slugText} numberOfLines={1}>
          {`v${manifest.version}`}
        </Text>

        <Text style={styles.descriptionText} numberOfLines={2}>
          {manifest.description}
        </Text>
      </View>
    </View>
  );
};

export const SectionHeader = ({ title, description }) => {
  return (
    <View style={styles.sectionHeaderContainer}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
      <Text style={styles.sectionHeaderTextDescription}>{description}</Text>
    </View>
  );
};

export const SectionContent = props => {
  return <View style={styles.sectionContentContainer}>{props.children}</View>;
};

export const AppIconPreview = ({ iconUrl }) => {
  if (!iconUrl) {
    iconUrl = 'https://s3.amazonaws.com/exp-brand-assets/ExponentEmptyManifest_192.png';
  }
  return <Image source={{ uri: iconUrl }} style={{ width: 64, height: 64 }} resizeMode='cover' />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.tintColor
  },
  titleTextContainer: {
    flex: 1
  },
  titleContainer: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 15,
    flexDirection: 'row'
  },
  titleIconContainer: {
    marginRight: 15,
    paddingTop: 2
  },
  sectionHeaderContainer: {
    backgroundColor: Colors.light,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ededed'
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  sectionHeaderTextDescription: {
    fontSize: 12
  },
  sectionContentContainer: {
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 15
  },
  nameText: {
    fontWeight: '600',
    fontSize: 18
  },
  slugText: {
    color: '#a39f9f',
    fontSize: 14,
    backgroundColor: 'transparent'
  },
  descriptionText: {
    fontSize: 12,
    marginTop: 6,
    flex: 1,
    flexWrap: 'wrap',
    color: '#4d4d4d'
  }
});
