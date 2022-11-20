import React, { useLayoutEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { AppInfo } from '../components/Common';
import Accordion from 'react-native-collapsible/Accordion';

import Styles from '../constants/Styles';

const InformationScreen = (props) => {
  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerTitle: 'Information',
    });
  });

  const [activeSections, setActiveSections] = useState([]);

  const topics = [
    { title: 'How to use the map', description: 'explain how to use the map' },
    { title: 'How to trace', description: 'explain how to trace locations' },
    { title: 'How to transform coordinates', description: 'explain how to transformt coordinates' },
    { title: 'How to export data', description: 'explain how to export data' },
  ];

  const _renderSectionTitle = (section) => {
    return (
      <View>
        <Text>{section.title}</Text>
      </View>
    );
  };

  const _renderHeader = (section) => {
    return (
      <View>
        <Text>asd</Text>
      </View>
    );
  };

  const _renderContent = (section) => {
    return (
      <View>
        <Text>{section.description}</Text>
      </View>
    );
  };

  const _updateSections = (activeSections) => {
    setActiveSections(activeSections);
  };

  return (
    <View style={{ ...Styles.container, paddingHorizontal: 10 }}>
      <AppInfo showDescription={false} />
      <Text style={Styles.header}> About </Text>
      <ScrollView>
        <Accordion
          sections={topics}
          activeSections={activeSections}
          renderSectionTitle={_renderSectionTitle}
          renderHeader={_renderHeader}
          renderContent={_renderContent}
          onChange={_updateSections}
        />
      </ScrollView>
    </View>
  );
};

export default InformationScreen;
