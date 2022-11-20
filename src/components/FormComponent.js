import React from 'react';
import PropTypes from 'prop-types';

import { getDomain } from '../collector/config';
import { events } from '../emitter';
import { getValidator } from 'validators';

import FormTextInput from './fields/FormTextInput';
import FormNumberInput from './fields/FormNumberInput';
import FormDropdown from './fields/FormDropdown';
import FormSwitch from './fields/FormSwitch';
import FormLocation from './fields/FormLocation';

export class FormComponent extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.validators = props.validators ? props.validators.map((v) => getValidator(v)) : [];

    // register changed events for dependency fields
    if (props.dependency) {
      this.registerEventsOnDependencyChanged(props.dependency);
    }
    if (props.fillValueFrom) {
      this.registerEventsOnDependencyFill(props.fillValueFrom);
    }

    const field = props.name,
      value = props.defaultValue,
      filterValue = null;
    let isValid = false;

    // if the defaultValue is defined, we must emit changed event so the filters can be initialized!
    if (value !== null) {
      isValid = this.isValidValue(value); // required?
      events().emit(`${field}:changed`, { field, value });
    }

    this.state = { value, isValid, filterValue };
  }

  componentWillUnmount() {
    this.unregisterEventsOnDependencyChanged(this.props.dependency);
    this.unregisterEventsOnDependencyFill(this.props.fillValueFrom);
  }

  registerEventsOnDependencyChanged = (dependency) => {
    events().on(`${dependency}:changed`, this.dependencyChanged);
  };

  unregisterEventsOnDependencyChanged = (dependency) => {
    events().off(`${dependency}:changed`, this.dependencyChanged);
  };

  registerEventsOnDependencyFill = (fillValueFrom) => {
    events().on(`${fillValueFrom}:fill`, this.fillFromDependency);
  };

  unregisterEventsOnDependencyFill = (fillValueFrom) => {
    events().off(`${fillValueFrom}:fill`, this.fillFromDependency);
  };

  dependencyChanged = ({ field, value }) => {
    this.setState({ filterValue: `${field}.${value}` });
  };

  fillFromDependency = ({ field, value }) => {
    if (this.props.name === field) {
      this.setState({ value });
    }
  };

  isValidValue = (value) => {
    return this.validators.every((validator) => {
      return validator.validate(value);
    });
  };

  updateValue = (value) => {
    // text inputs return values as strings!
    if (this.props.type === 'integer' || this.props.type === 'decimal') {
      value = Number(value);
    }

    const fieldName = this.props.name;
    const isValid = value !== null ? this.isValidValue(value) : false; // required?

    this.setState({ value, isValid });

    // emit changed event so all dependent fields can update their filters
    events().emit(`${fieldName}:changed`, { field: fieldName, value });

    // change dependent fields from domain's config
    if (this.props.domain) {
      const items = this.getDomainValues(this.props.domain);
      const item = items.find((i) => i.value === value);
      if (item && item.fill) {
        item.fill.forEach(({ field, value }) => {
          // emit fill event so all dependent fields can update their values,
          // as defined in domain's config
          events().emit(`${fieldName}:fill`, { field, value });
        });
      }
    }
  };

  getDomainValues = (domain, filterValue) => {
    const items = getDomain(domain);
    if (items) {
      return filterValue ? items.filter((v) => (v.filter ? v.filter === filterValue : true)) : items;
    } else {
      return [];
    }
  };

  render() {
    const { value, isValid } = this.state;
    const type = this.props.type;

    switch (type) {
      case 'text':
        return <FormTextInput {...this.props} value={value} isValid={isValid} onChange={this.updateValue} />;
      case 'integer':
        return <FormNumberInput {...this.props} value={value} keyboardType={'number-pad'} isValid={isValid} onChange={this.updateValue} />;
      case 'decimal':
        return <FormNumberInput {...this.props} value={value} keyboardType={'decimal-pad'} isValid={isValid} onChange={this.updateValue} />;
      case 'dropdown':
        const items = this.getDomainValues(this.props.domain, this.state.filterValue);
        return <FormDropdown {...this.props} value={value} items={items} isValid={isValid} onChange={this.updateValue} />;
      case 'switch':
        return <FormSwitch {...this.props} value={value} isValid={isValid} onChange={this.updateValue} />;
      case 'location':
        return <FormLocation {...this.props} isValid={isValid} onChange={this.updateValue} />;
      default:
        console.error(`Component not implemented: <${type}>!`);
        return null;
    }
  }
}

FormComponent.defaultProps = {
  editable: true,
  visible: true,
};

FormComponent.propTypes = {
  // type of form component
  type: PropTypes.oneOf(['text', 'integer', 'decimal', 'dropdown', 'switch', 'slider', 'location', 'photo']).isRequired,
  // base properties, valid for all components
  name: PropTypes.string.isRequired,
  alias: PropTypes.string,
  defaultValue: PropTypes.any,
  required: PropTypes.bool,
  errorText: PropTypes.string,
  fillValueFrom: PropTypes.string,
  validators: PropTypes.arrayOf(
    PropTypes.exact({
      name: PropTypes.string.isRequired,
      validValue: PropTypes.any.isRequired,
      errorMessage: PropTypes.string,
    })
  ),
  editable: PropTypes.bool,
  visible: PropTypes.bool,

  // for text input
  maxLength: PropTypes.number,
  // for masked text input
  mask: PropTypes.string,
  delimiter: PropTypes.string,
  // for dropdown: actually this should be a single value!
  dependency: PropTypes.string,
  domain: PropTypes.string,
  multiple: PropTypes.bool,
  // for slider
  minValue: PropTypes.number,
  maxValue: PropTypes.number,
  // for location
  accuracy: PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
  timeInterval: PropTypes.number,
  distanceInterval: PropTypes.number,
  // for photo?
};

export default FormComponent;
