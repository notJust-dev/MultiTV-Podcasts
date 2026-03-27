import React from 'react';
import {Image, ImageStyle} from 'react-native';

export interface HeaderLogoProps {
  style?: ImageStyle;
}

export const HeaderLogo = ({style}: HeaderLogoProps) => {
  return (
    <Image
      source={require('../../assets/web.png')}
      style={[style, {tintColor: '#FFFFFF'}]}
      resizeMode="contain"
    />
  );
};
