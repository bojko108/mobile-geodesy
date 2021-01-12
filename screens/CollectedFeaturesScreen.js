import React from 'react';
import { Alert, View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions } from '../store/actions';
import Styles from '../constants/Styles';
import { getConfigFor } from '../collector/config';
import { FloatingAction } from 'react-native-floating-action';
import SearchBar from '../components/SearchBar';

class CollectedFeaturesScreen extends React.Component {
  state = { searchString: null };

  deleteAllFeatures = () => {
    Alert.alert('Delete all collected features?', '', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        onPress: () => {
          this.props.actions.removeAllFeatures();
        },
      },
    ]);
  };

  deleteFeature = async ({ fid, properties }) => {
    Alert.alert('Delete feature?', this._getFeatureInfo(properties), [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        onPress: () => {
          this.props.actions.removeFeature(fid);
        },
      },
    ]);
  };

  showFeatureInfo = ({ properties }) => {
    const infoText = this._getFeatureInfo(properties);
    Alert.alert('Feature Info', infoText, [{ text: 'OK', style: 'cancel' }]);
  };

  _getFeatureInfo = (properties) => {
    return `${Object.keys(properties)
      .map((key) => `${key}: ${properties[key]}`)
      .join('\n')}`;
  };

  _handleActionPress = async (name) => {
    switch (name) {
      case 'bt_send_features':
        this.props.navigation.navigate('Export');
        break;
      case 'bt_collect_feature':
        this.props.navigation.navigate('CreateFeature');
        break;
      case 'bt_remove_features':
        this.deleteAllFeatures();
        break;
    }
  };

  render() {
    // TODO: filter collected features!

    const { searchString } = this.state;
    let collectedFeatures = this.props.collectedFeatures.slice(0);
    if (searchString) {
      collectedFeatures = this.props.collectedFeatures.filter((f) => {
        console.log(f);
        return Object.keys(f.properties).some((prop) => f.properties[prop].toString().toLowerCase().indexOf(searchString.toLowerCase()) > -1);
      });
    }

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
          <Button title='Remove all collected' color={Colors.darkBackground} onPress={this.deleteAllFeatures} />
        </View> */}
        {collectedFeatures.length < 1 && (
          <View>
            <Text style={{ ...Styles.header, paddingBottom: 20 }}>Currently there are no collected features to show!</Text>
            <Button title='Create feature' color={Colors.darkBackground} onPress={() => this.props.navigation.navigate('CreateFeature')} />
          </View>
        )}
        {collectedFeatures.length > 0 && (
          <FlatList
            data={collectedFeatures}
            keyExtractor={(item) => item.fid}
            stickyHeaderIndices={[0]}
            ListHeaderComponent={() => {
              return (
                <SearchBar
                  placeholder='Filter...'
                  showSearchIcon={false}
                  onChange={(searchString) => {
                    if (searchString.length > 2) {
                      this.setState({ searchString });
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
                  onPress={() => this.showFeatureInfo(item)}
                >
                  <Text key={`text-${item.fid}`} style={{ flex: 1, color: Colors.tintColor }}>
                    {config.alias}
                  </Text>
                  <Icon name='delete' size={24} color={Colors.tintColor} onPress={() => this.deleteFeature(item)}></Icon>
                </TouchableOpacity>
              );
            }}
          />
        )}
        {collectedFeatures.length > 0 && (
          <FloatingAction
            actions={actions}
            color={Colors.background}
            distanceToEdge={10}
            actionsPaddingTopBottom={2}
            floatingIcon={<Icon name='toolbox' size={24} color={Colors.tintColor} />}
            onPressItem={this._handleActionPress}
          />
        )}
      </View>
    );
  }
}

CollectedFeaturesScreen.navigationOptions = {
  //header: null
  title: 'Collected Features',
  headerStyle: {
    backgroundColor: Colors.background,
  },
  headerTintColor: Colors.tintColor,
  headerTitleStyle: {
    fontWeight: 'bold',
  },
  // headerRight: () => <Button onPress={() => alert('This is a button!')} title='Info' color='#fff' />
};

const mapStateToProps = (store, ownProps) => {
  const { collectedFeatures } = store;
  return { collectedFeatures };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CollectedFeaturesScreen);
