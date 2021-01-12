import React from 'react';
import { Alert, View, ScrollView, Button, SectionList, StyleSheet, TextInput, Text } from 'react-native';
import { ListHeader, SectionHeader, SectionContent } from '../components/Common';
import { getSetting, setSetting, getAllSettings, resetToDefaults } from '../storage';
import Colors from '../constants/Colors';
import Styles from '../constants/Styles';
import Dropdown from '../components/Dropdown';
import Separator from '../components/Separator';
import { FlatList } from 'react-native-gesture-handler';

class SettingsScreen extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = { settings: [] };

    this._loadSettings();
  }

  _loadSettings = async () => {
    let settings = getAllSettings(true);

    for (let i = 0; i < settings.length; i++) {
      settings[i].value = await getSetting(settings[i].key);
    }

    this.setState({ settings });
  };
  /**
   * Updates a setting value in current state and AsyncStorage
   */
  _updateSetting = async (key, value) => {
    let { settings } = this.state;
    for (let i = 0; i < settings.length; i++) {
      if (settings[i].key === key) {
        settings[i].value = value;
      }
    }
    this.setState({ settings });
    await setSetting(key, value);
  };

  _resetToDefaults = async () => {
    Alert.alert('Reset all settings?', 'All collected features will also be lost!', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        onPress: async () => {
          await resetToDefaults();
          this.props.navigation.goBack();
        },
      },
    ]);
  };

  _renderSectionHeader = ({ section }) => {
    return <SectionHeader title={section.title} description={section.data[0].value.description} />;
  };

  _renderItem = ({ item }) => {
    const setting = item.value;

    if (setting.type === 'text') {
      return (
        <SectionContent>
          <TextInput
            editable={setting.editable}
            style={styles.sectionContentText}
            value={setting.value}
            onChangeText={(text) => {
              this._updateSetting(setting.key, text);
            }}
          />
          <Separator />
        </SectionContent>
      );
    } else if (setting.type === 'number') {
      return (
        <SectionContent>
          <TextInput
            editable={setting.editable}
            keyboardType='number-pad'
            style={styles.sectionContentText}
            value={setting.value}
            onChangeText={(text) => {
              this._updateSetting(setting.key, text);
            }}
          />
          <Separator />
        </SectionContent>
      );
    } else if (setting.type === 'dropdown') {
      return (
        <SectionContent>
          <Dropdown
            enabled={setting.editable}
            selectedValue={setting.value}
            items={setting.options.map((item) => item)}
            onValueSelected={(itemValue) => {
              this._updateSetting(setting.key, itemValue);
            }}
          />
        </SectionContent>
      );
    } else {
      return (
        <SectionContent>
          <Text>For internal use only</Text>
        </SectionContent>
      );
    }
  };

  render() {
    const { settings } = this.state;
    if (settings.length < 1) return null;

    const sections = settings.map((setting) => {
      return { data: [{ value: setting }], title: setting.title };
    });

    return (
      <ScrollView
        style={{
          ...Styles.container,
          paddingHorizontal: 10,
        }}
      >
        <SectionList
          style={Styles.container}
          renderItem={this._renderItem}
          renderSectionHeader={this._renderSectionHeader}
          stickySectionHeadersEnabled={true}
          keyExtractor={(item, index) => index}
          ListHeaderComponent={ListHeader}
          sections={sections}
        />
        <View
          style={{
            paddingTop: 30,
            paddingBottom: 10,
          }}
        >
          <Text style={{ ...Styles.header }}>Danger zone! </Text>
          <Text style={{ paddingBottom: 10 }}>All settings including collected features will be reset!</Text>
          <Button title='Reset to defaults' color={Colors.errorBackground} onPress={this._resetToDefaults} />
        </View>
      </ScrollView>
    );
  }
}

SettingsScreen.navigationOptions = {
  title: 'Settings',
  headerStyle: {
    backgroundColor: Colors.background,
  },
  headerTintColor: Colors.tintColor,
  headerTitleStyle: {
    fontWeight: 'bold',
  },
};

const styles = StyleSheet.create({
  sectionContentText: {
    // color: '#808080',
    fontSize: 14,
    // borderColor: Colors.dark,
    // borderWidth: 1,
    paddingHorizontal: 10,
  },
});

export default SettingsScreen;
