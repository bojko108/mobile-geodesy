import React from 'react';
import { Alert, ScrollView, Text } from 'react-native';
import Colors from '../constants/Colors';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions } from '../store/actions';

import { getCollectableFeatures, getConfigFor } from '../collector/config';
import FormCollect from '../components/FormCollect';
import Styles from '../constants/Styles';
import Dropdown from '../components/Dropdown';

class CreateFeatureScreen extends React.Component {
  state = {
    featureType: 'object'
  };

  render() {
    const { featureType } = this.state;
    const config = getConfigFor(featureType);
    const collectableFeatures = getCollectableFeatures();
    return (
      <ScrollView
        style={{
          ...Styles.container,
          paddingHorizontal: 10
        }}
      >
        <Text style={Styles.header}>Feature Type</Text>
        <Dropdown
          selectedValue={featureType}
          items={collectableFeatures.map(({ name, alias }) => ({ label: alias, value: name }))}
          onValueSelected={featureType => {
            this.setState({ featureType });
          }}
        />
        {config && config.attributes ? (
          <FormCollect
            fields={config.attributes}
            onFinish={(properties, geometry) => {
              this.props.actions.addFeature({ properties, featureType, geometry });
              this.props.navigation.goBack();
            }}
            onCancel={() => {
              Alert.alert('Feature creation', 'Canceled');
              this.props.navigation.goBack();
            }}
          />
        ) : (
          <Text style={Styles.header}>No config is defined for feature type: {featureType}</Text>
        )}
      </ScrollView>
    );
  }
}

CreateFeatureScreen.navigationOptions = {
  //header: null
  title: 'Create Feature',
  headerStyle: {
    backgroundColor: Colors.background
  },
  headerTintColor: Colors.tintColor,
  headerTitleStyle: {
    fontWeight: 'bold'
  }
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

export default connect(null, mapDispatchToProps)(CreateFeatureScreen);
