import React from 'react';
import {Image, ImageStyle} from 'react-native';

export interface HeaderLogoProps {
  style?: ImageStyle;
}

export const HeaderLogo = ({style}: HeaderLogoProps) => {
  return (
    <Image
      source={require('../../assets/apple.png')}
      style={style}
      resizeMode="contain"
    />
  );
};
