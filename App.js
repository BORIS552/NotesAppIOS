/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import RemoteData from './src/components/RemoteData.js';

export default class App extends Component<{}> {
  constructor(props){
    super(props);
  }

  
  render() {
    return (
      <View style={styles.container}>
          <RemoteData />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding:10,
    marginTop: 100
  }
});
