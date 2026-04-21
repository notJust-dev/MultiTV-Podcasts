import {StyleSheet, Text, ImageBackground, View} from 'react-native';

import {scaleFontSize, scaleWidth, scaleHeight} from '../utils/scaling';
import podcast from '../data/trending.json';
import {PodcastCard} from '../components/PodcastCard';
import TrendingCarousel from '../components/TrendingCarousel';

export const HomeScreen = () => {
  return (
    <ImageBackground
      source={require('../assets/background.png')}
      style={styles.background}>
      <TrendingCarousel />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    padding: scaleWidth(160),
  },
});
