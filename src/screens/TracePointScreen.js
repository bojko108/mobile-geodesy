import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { View, Button, Text } from 'react-native';
import Colors from '../constants/Colors';
import { DEFAULT_CRS } from '../storage/settings';
import { transformPointToWGS84 } from '../calculations';

import Styles from '../constants/Styles';
import Dropdown from '../components/Dropdown';
import FormNumberInput from '../components/fields/FormNumberInput';
import { createFeature, getSetting, SETTINGS } from '../storage';
import { targetState } from '../store';

const TracePointScreen = (props) => {
  const [northing, setNorthing] = useState(null); //4601828.311
  const [easting, setEasting] = useState(null); //8499918.516
  const [crs, setCRS] = useState(null); //'BGS_1970_K9'
  const setTargetLocation = useSetRecoilState(targetState);

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerTitle: 'Trace point',
    });
  });

  const componentDidMount = () => {
    getSetting(SETTINGS.DEFAULT_CRS).then((newCRS) => {
      setCRS(newCRS);
    });
  };

  const setTargetPoint = async () => {
    if (northing && easting) {
      const input = [Number(northing), Number(easting)];
      const [latitude, longitude] = transformPointToWGS84(input, crs);

      const feature = await createFeature({}, { latitude, longitude });
      setTargetLocation(feature);

      props.navigation.goBack();
    }
  };

  const useGeographic = crs === 'WGS84';
  const northingLabel = useGeographic ? 'Latitude' : 'Northing';
  const eastingLabel = useGeographic ? 'Longitude' : 'Easting';

  useEffect(componentDidMount, []);

  return (
    <View style={{ ...Styles.container, paddingHorizontal: 10 }}>
      <Text style={Styles.header}> Coordinate System </Text>
      <Dropdown
        selectedValue={crs}
        items={DEFAULT_CRS.options}
        onValueSelected={(itemValue) => {
          setCRS(itemValue);
        }}
      />
      <Text style={Styles.title}> Target coordinates </Text>
      <FormNumberInput
        alias={northingLabel}
        isValid={true}
        value={northing}
        onChange={(value) => {
          setNorthing(value);
        }}
      />
      <FormNumberInput
        alias={eastingLabel}
        isValid={true}
        value={easting}
        onChange={(value) => {
          setEasting(value);
        }}
      />
      <View style={{ paddingTop: 20, paddingHorizontal: 10 }}>
        <Button title='Trace' color={Colors.darkBackground} onPress={setTargetPoint} />
      </View>
    </View>
  );
};

export default TracePointScreen;
