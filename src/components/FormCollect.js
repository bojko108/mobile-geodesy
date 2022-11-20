import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Button, View } from 'react-native';

import FormComponent from './FormComponent';
import Colors from '../constants/Colors';

export class FormCollect extends React.Component {
  constructor(props, context) {
    super(props);
    this.fieldRefs = {};
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.fields !== this.props.fields) {
      this.fieldRefs = {};
    }
  }

  // add a "Create" button to the header as well!
  createFeature = () => {
    let properties = {};
    let geometry = null;
    let valid = true;

    Object.keys(this.fieldRefs).forEach((key) => {
      const ref = this.fieldRefs[key].current;
      if (ref.state.isValid) {
        if (key === 'geometry') {
          geometry = ref.state.value.coords;
        } else {
          properties[key] = ref.state.value;
        }
      } else {
        valid = false;
      }
    });

    if (valid) {
      this.props.onFinish(properties, geometry);
    } else {
      console.error('there are invalid values');
    }
  };

  cancelFeature = () => {
    this.props.onCancel();
  };

  render() {
    const fields = this.props.fields;

    return (
      <View style={styles.container}>
        {fields
          .filter((f) => f.visible !== false)
          .map((field) => {
            const ref = React.createRef();
            this.fieldRefs[field.name] = ref;
            return <FormComponent ref={ref} key={field.name} {...field} />;
          })}
        <View style={{ paddingTop: 20, paddingHorizontal: 10 }}>
          {/* <StyledButton
            leftIcon={<Icon name='calendar-plus' size={24} color={Colors.tintColor} />}
            label='Create'
            rightIcon={<Icon name='calendar-plus' size={24} color={Colors.errorBackground} />}
          /> */}
          <Button title='Create' color={Colors.darkBackground} onPress={this.createFeature} />
          <Button title='Cancel' color={Colors.errorBackground} onPress={this.cancelFeature} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'center',
    // padding: 10
  },
});

FormCollect.protoTypes = {
  fields: PropTypes.arrayOf(PropTypes.object).isRequired,
  onFinish: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default FormCollect;
