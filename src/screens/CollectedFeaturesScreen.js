import React, { useLayoutEffect, useState } from 'react';
import { Alert, View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Styles from '../constants/Styles';
import { getConfigFor } from '../collector/config';
import { FloatingAction } from 'react-native-floating-action';
import SearchBar from '../components/SearchBar';
import { useRecoilValue } from 'recoil';
import { filteredFeatures } from '../store';

const CollectedFeaturesScreen = (props) => {
  const [searchString, setSearchString] = useState(null);

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerTitle: 'Collected Features',
    });
  });

  const deleteAllFeatures = () => {
    Alert.alert('Delete all collected features?', '', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        onPress: () => {
          props.actions.removeAllFeatures();
        },
      },
    ]);
  };

  const deleteFeature = async ({ fid, properties }) => {
    Alert.alert('Delete feature?', _getFeatureInfo(properties), [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        onPress: () => {
          props.actions.removeFeature(fid);
        },
      },
    ]);
  };

  const showFeatureInfo = ({ properties }) => {
    const infoText = _getFeatureInfo(properties);
    Alert.alert('Feature Info', infoText, [{ text: 'OK', style: 'cancel' }]);
  };

  const _getFeatureInfo = (properties) => {
    return `${Object.keys(properties)
      .map((key) => `${key}: ${properties[key]}`)
      .join('\n')}`;
  };

  const _handleActionPress = async (name) => {
    switch (name) {
      case 'bt_send_features':
        props.navigation.navigate('Export');
        break;
      case 'bt_collect_feature':
        props.navigation.navigate('CreateFeature');
        break;
      case 'bt_remove_features':
        deleteAllFeatures();
        break;
    }
  };

  const collectedFeatures = useRecoilValue(filteredFeatures(searchString));

  const actions = [
    {
      text: 'Send Features',
      icon: <Icon name='file-export' size={24} color={Colors.tintColor} />,
      color: Colors.darkBackground,
      name: 'bt_send_features',
      position: 1,
    },
    {
      text: 'Collect New Feature',
      icon: <Icon name='calendar-plus' size={24} color={Colors.tintColor} />,
      color: Colors.darkBackground,
      name: 'bt_collect_feature',
      position: 1,
    },
    {
      text: 'Remove all Features',
      icon: <Icon name='delete' size={24} color={Colors.tintColor} />,
      color: Colors.darkBackground,
      name: 'bt_remove_features',
      position: 1,
    },
  ];

  return (
    <View
      style={{
        ...Styles.container,
        paddingHorizontal: 10,
      }}
    >
      {/* <Text style={Styles.header}>List of Collected Features</Text>
        <View style={{ paddingTop: 20 }}>
          <Button title='Remove all collected' color={Colors.darkBackground} onPress={deleteAllFeatures} />
        </View> */}
      {collectedFeatures.length < 1 ? (
        <View>
          <Text style={{ ...Styles.header, paddingBottom: 20 }}>Currently there are no collected features to show!</Text>
          <Button title='Create feature' color={Colors.darkBackground} onPress={() => props.navigation.navigate('CreateFeature')} />
        </View>
      ) : null}
      {collectedFeatures.length > 0 ? (
        <FlatList
          data={collectedFeatures}
          keyExtractor={(item) => item.fid}
          stickyHeaderIndices={[0]}
          ListHeaderComponent={() => {
            return (
              <SearchBar
                placeholder='Filter...'
                showSearchIcon={false}
                onChange={(newSearchString) => {
                  if (newSearchString.length > 2) {
                    setSearchString(newSearchString);
                  }
                }}
              />
            );
          }}
          renderItem={({ item }) => {
            const config = getConfigFor(item.featureType);
            return (
              <TouchableOpacity
                key={item.fid}
                style={{ backgroundColor: config.map.color, ...Styles.listItem }}
                onPress={() => showFeatureInfo(item)}
              >
                <Text key={`text-${item.fid}`} style={{ flex: 1, color: Colors.tintColor }}>
                  {config.alias}
                </Text>
                <Icon name='delete' size={24} color={Colors.tintColor} onPress={() => deleteFeature(item)}></Icon>
              </TouchableOpacity>
            );
          }}
        />
      ) : null}
      {collectedFeatures.length > 0 ? (
        <FloatingAction
          actions={actions}
          color={Colors.background}
          distanceToEdge={10}
          actionsPaddingTopBottom={2}
          floatingIcon={<Icon name='toolbox' size={24} color={Colors.tintColor} />}
          onPressItem={_handleActionPress}
        />
      ) : null}
    </View>
  );
};

export default CollectedFeaturesScreen;
