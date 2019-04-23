// @flow

import React from 'react';
import { TextInput } from 'react-native';
import { code } from 'currency-codes';

// Polyfill for Intl until properly supported in Android
import 'intl';
import 'intl/locale-data/jsonp/en';

import type { KeyPressEvent } from 'TextInput';

type NumericTextInputType = 'currency' | 'decimal'

type NumericTextInputOptionsType = {
  currency?: string,
  decimalPlaces?: number,
  useGrouping?: boolean
}

type Props = NumericTextInputOptionsType & {
  locale?: string,
  onUpdate: (value: number) => mixed,
  type: NumericTextInputType,
  value?: number
}

const createFormatConfig = (style: NumericTextInputType, options: NumericTextInputOptionsType) => {
  let formatOptions = {
    style,
  };

  if (style === 'currency') {
    const { currency = 'GBP' } = options;
    const minimumFractionDigits = code(currency).digits;

    formatOptions = Object.assign({}, formatOptions, {
      currency,
      minimumFractionDigits,
    });
  } else {
    const {
      decimalPlaces = 0,
      useGrouping,
    } = options;

    formatOptions = Object.assign({}, formatOptions, {
      minimumFractionDigits: decimalPlaces,
      useGrouping,
    });
  }

  return formatOptions;
};

const parseNumberValue = (value?: number, decimalPlaces: number): string => {
  let stringValue = '';

  if (typeof value !== 'undefined') {
    const [
      integerPart = '0',
      fractionalPart = new Array(decimalPlaces).fill('0').join(''),
    ] = `${value}`.split('.');

    stringValue = `${integerPart}${fractionalPart}`;
  }

  return stringValue;
};

const parseStringValue = (value: string, decimalPlaces: number): number => (value !== '')
  ? parseInt(value, 10) / Math.pow(10, decimalPlaces)
  : 0;

const NumericTextInput = ({
  currency,
  decimalPlaces = 0,
  locale = 'en-GB',
  onUpdate,
  type = 'decimal',
  useGrouping,
  value = 0,
  ...textInputProps
}: Props) => {
  const formatConfig = createFormatConfig(type, { currency, decimalPlaces, useGrouping });
  const stringValue = parseNumberValue(value, formatConfig.minimumFractionDigits);

  const updateValue = (key: string, updateCallback: (value: number) => mixed) => {
    let newValue = '';

    if (/^\d|Backspace$/.test(key)) {
      if (key === 'Backspace') {
        if (stringValue !== '') {
          newValue = stringValue.substring(0, stringValue.length - 1);
        }
      } else {
        newValue = `${stringValue}${key}`;
      }

      updateCallback(parseStringValue(newValue, formatConfig.minimumFractionDigits));
    }
  };

  const formatValue = (numberValue: number): string => {
    return new Intl.NumberFormat(locale, formatConfig).format(numberValue);
  };

  return (
    <TextInput
      {...textInputProps}
      onKeyPress={({ nativeEvent: { key } }: KeyPressEvent) => updateValue(key, onUpdate)}
      value={formatValue(value)}
      keyboardType="number-pad"
    />
  );
};

export default NumericTextInput;
