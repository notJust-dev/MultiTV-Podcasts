import React from 'react';
import {ImageSourcePropType, StyleSheet, Text} from 'react-native';

export interface TileData {
  id: string;
  label: string;
  accessibilityLabel: string;
  description: string | React.ReactNode;
  icon: ImageSourcePropType;
}

const descStyles = StyleSheet.create({
  underline: {
    textDecorationLine: 'underline',
  },
  bold: {
    fontWeight: 'bold',
  },
});

export const tiles: TileData[] = [
  {
    id: 'home',
    label: 'Home',
    accessibilityLabel: 'Home',
    description:
      'Welcome to Vega. Select one of the options below to start your journey.',
    icon: require('../assets/home.png'),
  },
  {
    id: 'api-demo',
    label: 'API\nDemo',
    accessibilityLabel: 'API Demo',
    description: 'Press select to fetch a random joke from the API.',
    icon: require('../assets/get-started.png'),
  },
  {
    id: 'debug',
    label: 'Test &\nDebug',
    accessibilityLabel: 'Test and Debug',
    description:
      "Press 'd' in the Metro terminal for the developer menu, or debug via Chrome Dev Tools in Vega Studio.",
    icon: require('../assets/debug.png'),
  },
  {
    id: 'animation',
    label: 'Animated\nDemo',
    accessibilityLabel: 'Animated Demo',
    description: 'A Lottie animation demo powered by React Native.',
    icon: require('../assets/learn-more.png'),
  },
];
