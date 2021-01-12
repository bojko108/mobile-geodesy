import React from 'react';
import { View, StyleSheet, Button, Text } from 'react-native';
import Colors from '../constants/Colors';
import { DEFAULT_CRS } from '../storage/settings';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { transformPointToWGS84 } from '../calculations';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions } from '../store/actions';
import Styles from '../constants/Styles';
import Dropdown from '../components/Dropdown';
import FormNumberInput from '../components/fields/FormNumberInput';
import { getSetting, SETTINGS } from '../storage';

class TracePointScreen extends React.Component {
  constructor(props, context) {
    super(props);
    this.state = {
      northing: null, //4601828.311,
      easting: null, //8499918.516,
      crs: null, //'BGS_1970_K9'
    };
  }

  // TODO: replace constructor with this
  // state = {
  //   northing: null,
  //   easting: null,
  //   crs: null
  // };

  componentDidMount() {
    getSetting(SETTINGS.DEFAULT_CRS).then((crs) => {
      this.setState({ crs });
    });
  }

  setTargetPoint = () => {
    const { northing, easting, crs } = this.state;
    if (northing && easting) {
      const input = [Number(northing), Number(easting)];
      const [latitude, longitude] = transformPointToWGS84(input, crs);

      this.props.actions.traceFeature({ latitude, longitude });
      this.props.navigation.goBack();
    }
  };

  render() {
    const { crs, northing, easting } = this.state;
    const useGeographic = crs === 'WGS84';
    const northingLabel = useGeographic ? 'Latitude' : 'Northing';
    const eastingLabel = useGeographic ? 'Longitude' : 'Easting';

    return (
      <View style={{ ...Styles.container, paddingHorizontal: 10 }}>
        <Text style={Styles.header}>Coordinate System</Text>
        <Dropdown
          selectedValue={crs}
          items={DEFAULT_CRS.options}
          onValueSelected={(itemValue) => {
            this.setState({ crs: itemValue });
          }}
        />
        <Text style={Styles.title}>Target coordinates</Text>
        <FormNumberInput
          alias={northingLabel}
          isValid={true}
          value={northing}
          onChange={(value) => {
            this.setState({ northing: value });
          }}
        />
        <FormNumberInput
          alias={eastingLabel}
          isValid={true}
          value={easting}
          onChange={(value) => {
            this.setState({ easting: value });
          }}
        />
        <View style={{ paddingTop: 20, paddingHorizontal: 10 }}>
          <Button title='Trace' color={Colors.darkBackground} onPress={this.setTargetPoint} />
        </View>
      </View>
    );
  }
}

TracePointScreen.navigationOptions = {
  //header: null
  title: 'Trace point',
  headerStyle: {
    backgroundColor: Colors.background,
  },
  headerTintColor: Colors.tintColor,
  headerTitleStyle: {
    fontWeight: 'bold',
  },
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default connect(null, mapDispatchToProps)(TracePointScreen);
