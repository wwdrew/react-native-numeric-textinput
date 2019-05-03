// @flow

import React, { PureComponent } from 'react';
import { TextInput } from 'react-native';
import { code } from 'currency-codes';

// Polyfill for Intl until properly supported in Android
import 'intl';
import 'intl/locale-data/jsonp/en';

type NumericTextInputType = "currency" | "decimal";

type NumericTextInputOptionsType = {
  currency?: string,
  decimalPlaces?: number,
  useGrouping?: boolean,
};

type Props = NumericTextInputOptionsType & {
  locale?: string,
  onUpdate: (value: ?number) => mixed,
  type?: NumericTextInputType,
  value?: number,
};

type NumberFormatConfig = {
  divisor: number,
  type: NumericTextInputType,
  locale: string,
  minimumFractionDigits: number,
};

class NumericTextInput extends PureComponent<Props> {
  formatConfig: NumberFormatConfig;

  constructor(props: Props) {
    super(props);

    this.formatConfig = this.createFormatConfig(props);
  }

  createFormatConfig(props: Props): NumberFormatConfig {
    const { locale = 'en-GB', type = 'decimal', useGrouping = true } = props;
    const typeOptions = {};
    let { decimalPlaces = 0 } = props;

    if (type === 'currency') {
      const { currency = 'GBP' } = props;

      typeOptions.currency = currency;
      decimalPlaces = code(currency).digits;
    } else {
      typeOptions.minimumFractionDigits = decimalPlaces;
    }

    return Object.assign({}, typeOptions, {
      locale,
      style: type,
      useGrouping,
      divisor: Math.pow(10, decimalPlaces),
    });
  };

  formatNumberValue(
    numberValue?: number,
    numberFormatConfig: NumberFormatConfig
  ): string {
    let returnValue = '';

    if (numberValue) {
      const { locale, ...config } = numberFormatConfig;

      returnValue = new Intl.NumberFormat(locale, config).format(numberValue);
    }

    return returnValue;
  }

  parseStringValue(
    text: string,
    numberFormatConfig: NumberFormatConfig,
  ): ?number {
    const digitsOnly = text.match(/\d+/g);

    return digitsOnly
      ? parseInt(digitsOnly.join(''), 10) / numberFormatConfig.divisor
      : undefined;
  }

  onUpdate = (text: string) => {
    const { onUpdate } = this.props;
    const parsedValue = this.parseStringValue(text, this.formatConfig);

    if (onUpdate) {
      onUpdate(parsedValue);
    }
  };

  render() {
    const { onUpdate, value, ...textInputProps } = this.props;

    return (
      <TextInput
        {...textInputProps}
        value={this.formatNumberValue(value, this.formatConfig)}
        keyboardType="number-pad"
        onChangeText={this.onUpdate}
        caretHidden={true}
      />
    );
  }
}

export default NumericTextInput;
