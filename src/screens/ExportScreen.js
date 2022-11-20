import React, { useLayoutEffect, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import Constants from 'expo-constants';
import * as MailComposer from 'expo-mail-composer';
import * as FileSystem from 'expo-file-system';
import { View, Button, Text } from 'react-native';
import Colors from '../constants/Colors';
import { DEFAULT_CRS, FILE_EXPORT_TYPE } from '../storage/settings';
import { getSetting, SETTINGS } from '../storage';
import { writeAsDXF, writeAsGeoJSON, writeAsScript } from '../exports';

import Styles from '../constants/Styles';
import Dropdown from '../components/Dropdown';
import { getDateFormatted } from '../calculations';
import { featuresState } from '../store';

const ExportScreen = (props) => {
  const [crs, setCRS] = useState(null);
  const [exportType, setExportType] = useState(null);
  const collectedFeatures = useRecoilValue(featuresState);

  const componentDidMount = () => {
    const worker = async () => {
      const newCRS = await getSetting(SETTINGS.DEFAULT_CRS);
      setCRS(newCRS);
      const newExportType = getSetting(SETTINGS.FILE_EXPORT_TYPE);
      setExportType(newExportType);
    };

    worker().catch(console.error);
  };

  const sendEmail = async () => {
    const recipient = await getSetting(SETTINGS.EMAIL);
    if (!recipient) {
      Alert.alert('First define an email address in Settings!', '', [{ text: 'OK', style: 'cancel' }]);
      return;
    }

    const fileName = getDateFormatted();
    let extension;
    let fileContent;

    switch (exportType) {
      case 'dxf':
        fileContent = writeAsDXF(collectedFeatures, crs);
        extension = '.dxf';
        break;
      case 'script':
        fileContent = writeAsScript(collectedFeatures, crs);
        extension = '.changeto-scr';
        break;
      case 'geojson':
        fileContent = writeAsGeoJSON(collectedFeatures, crs);
        fileContent = JSON.stringify(fileContent);
        extension = '.geojson';
        break;
    }

    const fileUri = `${FileSystem.cacheDirectory}collected-data`;
    const { exists } = await FileSystem.getInfoAsync(fileUri);
    if (exists) {
      await FileSystem.deleteAsync(fileUri);
    }
    await FileSystem.makeDirectoryAsync(fileUri);

    const path = `${fileUri}/${fileName}${extension}`;
    await FileSystem.writeAsStringAsync(path, fileContent);

    await MailComposer.composeAsync({
      recipients: [recipient],
      subject: `${Constants.manifest.name} - ${fileName}`,
      body: `Data collected with ${Constants.manifest.name} App, stored in file:\n${path}`,
      attachments: [path],
      isHtml: false,
    });
  };

  useEffect(componentDidMount, []);
  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerTitle: 'Export collected features',
    });
  });

  return (
    <View style={{ ...Styles.container, paddingHorizontal: 10 }}>
      <Text style={Styles.header}>Choose Export Type</Text>
      <Dropdown
        selectedValue={exportType}
        items={FILE_EXPORT_TYPE.options}
        onValueSelected={(itemValue) => {
          setExportType(itemValue);
        }}
      />
      <Text style={Styles.header}>Coordinate System</Text>
      <Dropdown
        selectedValue={crs}
        items={DEFAULT_CRS.options}
        onValueSelected={(itemValue) => {
          setCRS(itemValue);
        }}
      />
      <View style={{ paddingTop: 20, paddingHorizontal: 10 }}>
        <Button title='Export' color={Colors.darkBackground} onPress={sendEmail} />
      </View>
    </View>
  );
};

export default ExportScreen;
