import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TextInput } from 'react-native';

export class FormMaskInput extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.fieldRefs = {};

    const { delimiter, mask, value } = props;

    // value can be removed: values = []...

    const values = value.split(delimiter);
    const fields = mask.split(delimiter).map((item, index, array) => {
      const isText = item.indexOf('@') > -1;
      return {
        mask: item,
        isLast: array.length - 1 === index,
        isText,
        length: item.length
      };
    });

    this.state = { values, fields, delimiter };
  }

  __updateField = (index, text) => {
    const { fields, delimiter } = this.state;
    let values = this.state.values;
    values[index] = text;
    this.setState({ values });

    // if all characters are entered, go to next input
    if (fields[index].length === text.length) {
      this.__focusInputByIndex(index + 1);
    }

    this.props.onChange(values.join(delimiter));
  };

  __focusInputByIndex = index => {
    if (index < this.state.fields.length) {
      this.fieldRefs[`ref-${index}`].current.focus();
    }
  };

  render() {
    const { fields, values, delimiter } = this.state;

    return (
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          {fields.map((field, index) => {
            const ref = React.createRef();
            this.fieldRefs[`ref-${index}`] = ref;
            const items = [
              <TextInput
                key={index}
                ref={ref}
                placeholder={field.mask}
                value={values[index]}
                maxLength={field.length}
                autoCapitalize={'characters'}
                keyboardType={field.isText ? 'default' : 'numeric'}
                returnKeyType={field.isLast ? 'done' : 'next'}
                blurOnSubmit={false}
                onSubmitEditing={() => this.__focusInputByIndex(index + 1)}
                onChangeText={newText => {
                  this.__updateField(index, newText.toUpperCase());
                }}
              />
            ];
            if (field.isLast === false) {
              items.push(<Text key={index + 'd'}>{delimiter}</Text>);
            }
            return items;
          })}
        </View>
      </View>
    );
  }
}

FormMaskInput.propTypes = {
  mask: PropTypes.string.isRequired,
  delimiter: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default FormMaskInput;
