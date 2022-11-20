import React, { useLayoutEffect, useState } from 'react';
import { Alert, ScrollView, Text } from 'react-native';

import { useSetRecoilState } from 'recoil';
import { featuresState } from '../store';

import { getCollectableFeatures, getConfigFor } from '../collector/config';
import FormCollect from '../components/FormCollect';
import Styles from '../constants/Styles';
import Dropdown from '../components/Dropdown';
import { addCollectedFeature } from '../storage';

const CreateFeatureScreen = (props) => {
  const [featureType, setFeatureType] = useState('object');

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerTitle: 'Create Feature',
    });
  });

  const config = getConfigFor(featureType);
  const collectableFeatures = getCollectableFeatures();
  const setFeatures = useSetRecoilState(featuresState);

  return (
    <ScrollView
      style={{
        ...Styles.container,
        paddingHorizontal: 10,
      }}
    >
      <Text style={Styles.header}>Feature Type</Text>
      <Dropdown
        selectedValue={featureType}
        items={collectableFeatures.map(({ name, alias }) => ({ label: alias, value: name }))}
        onValueSelected={(newFeatureType) => {
          setFeatureType(newFeatureType);
        }}
      />
      {config && config.attributes ? (
        <FormCollect
          fields={config.attributes}
          onFinish={async (properties, geometry) => {
            const feature = await addCollectedFeature({ properties, featureType, geometry });
            setFeatures((oldFeatures) => oldFeatures.push(feature));
            props.navigation.goBack();
          }}
          onCancel={() => {
            Alert.alert('Feature creation', 'Canceled');
            props.navigation.goBack();
          }}
        />
      ) : (
        <Text style={Styles.header}>No config is defined for feature type: {featureType}</Text>
      )}
    </ScrollView>
  );
};

export default CreateFeatureScreen;
