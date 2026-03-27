/*
 * Copyright (c) 2022 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL.  USE IS SUBJECT TO LICENSE TERMS.
 */

import React from 'react';
import {StyleSheet, ImageBackground} from 'react-native';
import {HomeScreen} from '@multitv/shared';

export const App = () => {
  return (
    <ImageBackground
      source={require('./assets/background.png')}
      style={styles.background}>
      <HomeScreen />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
});
