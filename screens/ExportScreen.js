import React from 'react';
import Constants from 'expo-constants';
import * as MailComposer from 'expo-mail-composer';
import * as FileSystem from 'expo-file-system';
import { View, Button, Text } from 'react-native';
import Colors from '../constants/Colors';
import { DEFAULT_CRS, FILE_EXPORT_TYPE } from '../storage/settings';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getSetting, SETTINGS } from '../storage';
import { writeAsDXF, writeAsGeoJSON, writeAsScript } from '../exports';

import { connect } from 'react-redux';
import Styles from '../constants/Styles';
import Dropdown from '../components/Dropdown';
import { getDateFormatted } from '../calculations';

class ExportScreen extends React.Component {
  state = {
    crs: null,
    exportType: null,
  };

  componentDidMount() {
    getSetting(SETTINGS.DEFAULT_CRS).then((crs) => {
      this.setState({ crs });
    });
    getSetting(SETTINGS.FILE_EXPORT_TYPE).then((exportType) => {
      this.setState({ exportType });
    });
  }

  sendEmail = async () => {
    const { crs, exportType } = this.state;
    const { collectedFeatures } = this.props;

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

  render() {
    const { crs, exportType } = this.state;
    const useGeographic = crs === 'WGS84';

    return (
      <View style={{ ...Styles.container, paddingHorizontal: 10 }}>
        <Text style={Styles.header}>Choose Export Type</Text>
        <Dropdown
          selectedValue={exportType}
          items={FILE_EXPORT_TYPE.options}
          onValueSelected={(itemValue) => {
            this.setState({ exportType: itemValue });
          }}
        />
        <Text style={Styles.header}>Coordinate System</Text>
        <Dropdown
          selectedValue={crs}
          items={DEFAULT_CRS.options}
          onValueSelected={(itemValue) => {
            this.setState({ crs: itemValue });
          }}
        />
        <View style={{ paddingTop: 20, paddingHorizontal: 10 }}>
          <Button title='Export' color={Colors.darkBackground} onPress={this.sendEmail} />
        </View>
      </View>
    );
  }
}

ExportScreen.navigationOptions = {
  //header: null
  title: 'Export collected features',
  headerStyle: {
    backgroundColor: Colors.background,
  },
  headerTintColor: Colors.tintColor,
  headerTitleStyle: {
    fontWeight: 'bold',
  },
};

const mapStateToProps = (store, ownProps) => {
  const { collectedFeatures } = store;
  return { collectedFeatures };
};

export default connect(mapStateToProps, null)(ExportScreen);
