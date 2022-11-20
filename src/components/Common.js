import React from 'react';
import PropTypes from 'prop-types';
import Constants from 'expo-constants';
import { StyleSheet, Button, Image, Text, View } from 'react-native';
import Colors from '../constants/Colors';
import Styles from '../constants/Styles';

const { manifest } = Constants;

const AppInfo = ({ showAppName, showVersion, showIcon, showDescription }) => {
  return (
    <View style={styles.titleContainer}>
      {showIcon ? (
        <View style={styles.titleIconContainer}>
          <AppIconPreview iconUrl={manifest.iconUrl} />
        </View>
      ) : null}

      <View style={styles.titleTextContainer}>
        {showAppName ? (
          <Text style={styles.nameText} numberOfLines={1}>
            {manifest.name}
          </Text>
        ) : null}

        {showVersion ? (
          <Text style={styles.versionText} numberOfLines={1}>
            {`v${manifest.version}`}
          </Text>
        ) : null}

        {showDescription ? (
          <Text style={styles.descriptionText} numberOfLines={2}>
            {manifest.description}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

AppInfo.defaultProps = {
  showAppName: true,
  showVersion: true,
  showIcon: true,
  showDescription: true,
};

AppInfo.propTypes = {
  showAppName: PropTypes.bool,
  showVersion: PropTypes.bool,
  showIcon: PropTypes.bool,
  showDescription: PropTypes.bool,
};

const ListFooter = ({ onButtonPress }) => {
  return (
    <View
      style={{
        ...Styles.container,
        paddingTop: 30,
        paddingBottom: 10,
        paddingHorizontal: 10,
      }}
    >
      <Text style={{ ...Styles.header }}>Danger zone! </Text>
      <Text style={{ paddingBottom: 10 }}>All settings including collected features will be reset!</Text>
      <Button title='Reset to defaults' color={Colors.errorBackground} onPress={onButtonPress} />
    </View>
  );
};

ListFooter.defaultProps = {
  onButtonPress: () => {},
};

ListFooter.propTypes = {
  onButtonPress: PropTypes.func,
};

const SectionHeader = ({ title, description }) => {
  return (
    <View style={styles.sectionHeaderContainer}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
      <Text style={styles.sectionHeaderTextDescription}>{description}</Text>
    </View>
  );
};

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export const SectionContent = (props) => {
  return <View style={styles.sectionContentContainer}>{props.children}</View>;
};

export const AppIconPreview = ({ iconUrl }) => {
  if (!iconUrl) {
    iconUrl = 'https://s3.amazonaws.com/exp-brand-assets/ExponentEmptyManifest_192.png';
  }
  return <Image source={{ uri: iconUrl }} style={{ width: 64, height: 64 }} resizeMode='cover' />;
};

export { AppInfo, ListFooter, SectionHeader };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.tintColor,
  },
  titleTextContainer: {
    flex: 1,
  },
  titleContainer: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 15,
    flexDirection: 'row',
  },
  titleIconContainer: {
    marginRight: 15,
    paddingTop: 2,
  },
  sectionHeaderContainer: {
    backgroundColor: Colors.light,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ededed',
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  sectionHeaderTextDescription: {
    fontSize: 12,
  },
  sectionContentContainer: {
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 15,
  },
  nameText: {
    fontWeight: '600',
    fontSize: 18,
  },
  versionText: {
    color: '#aaa',
    fontSize: 14,
    backgroundColor: 'transparent',
  },
  descriptionText: {
    fontSize: 12,
    marginTop: 6,
    flex: 1,
    flexWrap: 'wrap',
    color: '#4d4d4d',
  },
});
