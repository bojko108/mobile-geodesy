import React from 'react';
import PropTypes from 'prop-types';
import { View, TextInput } from 'react-native';
import Styles from '../constants/Styles';
import Separator from './Separator';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../constants/Colors';

class SearchBar extends React.Component {
  state = { value: '' };

  render() {
    const { value } = this.state;
    const { placeholder, onChange, minLength, showSearchIcon } = this.props;
    return (
      <View style={{ ...Styles.container, paddingVertical: 10, backgroundColor: Colors.tintColor }}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          {showSearchIcon && <Icon style={{ flex: 1 }} name='magnify' size={24} color={Colors.darkBackground} />}
          <TextInput
            style={{ flex: 6 }}
            placeholder={placeholder}
            value={value.toString()}
            onChangeText={value => {
              this.setState({ value });
              if (value && value.length >= minLength) {
                onChange(value);
              }
            }}
          />
        </View>
        <Separator />
      </View>
    );
  }
}

//     <TextInput value={value} editable maxLength={maxLength} onChangeText={onChange} />

SearchBar.defaultProps = {
  minLength: 3,
  placeholder: 'Search...',
  showSearchIcon: true
};

SearchBar.propTypes = {
  showSearchIcon: PropTypes.bool,
  minLength: PropTypes.number,
  onChange: PropTypes.func,
  placeholder: PropTypes.string
};

export default SearchBar;
