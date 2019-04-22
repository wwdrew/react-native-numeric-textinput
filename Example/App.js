/**
 * @format
 * @flow
 */

import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import NumericInput from '@wwdrew/react-native-numeric-textinput'

import type { TextStyleProp, ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet'

const App = () => {
  const [value, setValue] = useState()

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Decimal</Text>
      <NumericInput
        type='decimal'
        decimalPlaces={3}
        value={value}
        onUpdate={(value) => setValue(value)}
      />
      <Text>Decimal Value: {value}</Text>
    </View>
  )
}

export default App

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
