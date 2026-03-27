import React from 'react';
import {View, Text, Platform, StyleSheet} from 'react-native';
import {scaleFontSize, scaleWidth, scaleHeight} from '../../utils/scaling';
import {HeaderLogo} from './HeaderLogo';

const platformName = Platform.select({
  ios: 'iOS',
  android: 'Android',
  web: 'Web',
  default: 'Vega',
});

export const Header = () => {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.headerText}>Hello {platformName},</Text>
        <Text style={styles.subHeaderText}>
          Select one of the options to start your development journey 🚀
        </Text>
      </View>
      <HeaderLogo style={styles.vegaLogo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
  },
  textContainer: {
    flex: 1,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: scaleFontSize(160),
    fontWeight: 'bold',
  },
  subHeaderText: {
    color: '#FFFFFF',
    fontSize: scaleFontSize(60),
  },
  vegaLogo: {
    width: scaleWidth(500),
    height: scaleHeight(350),
    marginLeft: scaleWidth(80),
    resizeMode: 'contain',
  },
});
