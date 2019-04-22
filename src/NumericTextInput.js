// @flow

import React, { useState } from 'react'
import { TextInput } from 'react-native'
import { code } from 'currency-codes'

import type { KeyPressEvent } from 'TextInput'

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
    style
  }

  if (style === 'currency') {
    const { currency = 'GBP' } = options
    const minimumFractionDigits = code(currency).digits

    formatOptions = Object.assign({}, formatOptions, {
      currency,
      minimumFractionDigits
    })
  } else {
    const {
      decimalPlaces = 0,
      useGrouping
    } = options

    formatOptions = Object.assign({}, formatOptions, {
      minimumFractionDigits: decimalPlaces,
      useGrouping
    })
  }

  return formatOptions
}

const parseInitialValue = (value?: number, decimalPlaces: number): string => {
  let initialStringValue = ''

  if (typeof value !== 'undefined') {
    const [
      integerPart = '0',
      fractionalPart = new Array(decimalPlaces).fill('0').join('')
    ] = `${value}`.split('.')

    initialStringValue = `${integerPart}${fractionalPart}`
  }

  console.log('initial', { value, initialStringValue })
  return initialStringValue
}

const parseValueString = (value: string, decimalPlaces: number): number => (value !== '')
  ? parseInt(value, 10) / Math.pow(10, decimalPlaces)
  : 0

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
  const formatConfig = createFormatConfig(type, { currency, decimalPlaces, useGrouping })
  const [stringValue, setStringValue] = useState(parseInitialValue(value, formatConfig.minimumFractionDigits))
  const [numberValue, setNumberValue] = useState(value)

  const updateValue = (key: string, onUpdate: (value: number) => mixed) => {
    let newValue = ''

    if (/^\d|Backspace$/.test(key)) {
      if (key === 'Backspace') {
        if (stringValue !== '') {
          newValue = stringValue.substring(0, stringValue.length - 1)
        }
      } else {
        newValue = `${stringValue}${key}`
      }

      const newNumberValue = parseValueString(newValue, formatConfig.minimumFractionDigits)

      setStringValue(newValue)
      setNumberValue(newNumberValue)
      onUpdate(newNumberValue)
    }
  }

  const formatValue = (value: number): string => {
    return new Intl.NumberFormat(locale, formatConfig).format(value)
  }

  return (
    <TextInput
      {...textInputProps}
      onKeyPress={({ nativeEvent: { key } }: KeyPressEvent) => updateValue(key, onUpdate)}
      value={formatValue(numberValue)}
      keyboardType="number-pad"
    />
  )
}

export default NumericTextInput
