import React from 'react';
import PropTypes from 'prop-types';
import { Modal, View, FlatList, Text, TouchableOpacity } from 'react-native';
import Styles from '../constants/Styles';
import Colors from '../constants/Colors';

class SelectBasemapModal extends React.Component {
  render() {
    const { visible, selected, basemaps, onBasemapSelected } = this.props;

    return (
      <Modal
        animationType='slide'
        transparent={false}
        visible={visible}
        onRequestClose={() => {
          onBasemapSelected(selected);
        }}
      >
        <View
          style={{
            ...Styles.container,
            paddingHorizontal: 10,
          }}
        >
          <Text key='header-text' style={{ ...Styles.header, paddingVertical: 20 }}>
            Select a new basemap. To close this list, click the back button or select a new basemap:
          </Text>
          <FlatList
            data={basemaps}
            keyExtractor={({ label }) => `${label}-key`}
            stickyHeaderIndices={[0]}
            renderItem={({ item }) => {
              const color = selected === item.value ? Colors.tintColor : Colors.dark;
              const backgroundColor = selected === item.value ? Colors.background : Colors.light;
              return (
                <TouchableOpacity
                  key={`${item.label}-touch`}
                  style={{ ...Styles.listItem, backgroundColor }}
                  onPress={() => onBasemapSelected(item.value)}
                >
                  <View>
                    <Text key={`${item.label}-text`} style={{ flex: 1, color }}>
                      {item.label}
                    </Text>
                    <Text key={`${item.label}-text-desc`} style={{ ...Styles.subHeader, flex: 1, color }}>
                      {item.value}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </Modal>
    );
  }
}

SelectBasemapModal.defaultProps = {
  visible: false,
  basemaps: [],
};

SelectBasemapModal.propTypes = {
  visible: PropTypes.bool,
  selected: PropTypes.string,
  basemaps: PropTypes.arrayOf(
    PropTypes.exact({
      label: PropTypes.string,
      value: PropTypes.string,
    })
  ),
  onBasemapSelected: PropTypes.func.isRequired,
};

export default SelectBasemapModal;
