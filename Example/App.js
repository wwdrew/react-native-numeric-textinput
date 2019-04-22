/**
 * @format
 * @flow
 */

import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import NumericInput from '@wwdrew/react-native-numeric-textinput'

import type { TextStyleProp, ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet'

type Props = {}
type State = {
  // percentValue?: number,
  decimalValue?: number,
  currencyValue?: number
}

export default class App extends Component<Props, State> {
  state = {
    // percentValue: 0.76,
    decimalValue: 12345,
    currencyValue: 123.45
  }

  onUpdate = (type: string, value: number) => {
    this.setState({ [`${type}Value`]: value }, () => console.log(`${type} app value`, this.state[`${type}Value`]))
  }

  render () {
    const { decimalValue, currencyValue } = this.state

    return (
      <View style={styles.container}>
        {/* <Text style={styles.welcome}>Percentage</Text>
        <NumericInput
          style={{ borderWidth: 1, borderColor: 'red', padding: 10 }}
          type='percent'
          decimalPlaces={4}
          value={percentValue}
          onUpdate={(value) => this.onUpdate('percent', value)}
        />
        <Text>Percent Value: {percentValue}</Text> */}

        <Text style={styles.welcome}>Decimal</Text>
        <NumericInput
          type='decimal'
          decimalPlaces={3}
          value={decimalValue}
          onUpdate={(value) => this.onUpdate('decimal', value)}
        />
        <Text>Decimal Value: {decimalValue}</Text>

        <Text style={styles.welcome}>Currency</Text>
        <NumericInput
          type='currency'
          currency='GBP'
          value={currencyValue}
          onUpdate={(value) => this.onUpdate('currency', value)}
        />
        <Text>Currency Value: {currencyValue}</Text>
      </View>
    )
  }
}

const styles: {
  container: ViewStyleProp,
  welcome: TextStyleProp
} = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  }
})
