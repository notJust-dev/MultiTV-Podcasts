import {
  StyleSheet,
  Text,
  ImageBackground,
  View,
  Pressable,
} from 'react-native';

import {scaleFontSize, scaleWidth, scaleHeight} from '../utils/scaling';
import TrendingCarousel from '../components/TrendingCarousel';

interface HomeScreenProps {
  onPodcastPress?: (id: string | number) => void;
  onSearchPress?: () => void;
}

export const HomeScreen = ({
  onPodcastPress,
  onSearchPress,
}: HomeScreenProps = {}) => {
  return (
    <ImageBackground
      source={require('../assets/background.png')}
      style={styles.background}>
      {onSearchPress ? (
        <View style={styles.topBar}>
          <Pressable
            onPress={onSearchPress}
            style={({focused}) => [
              styles.searchButton,
              focused && styles.searchButtonFocused,
            ]}>
            <Text style={styles.searchLabel}>Search</Text>
          </Pressable>
        </View>
      ) : null}
      <TrendingCarousel onPodcastPress={onPodcastPress} />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    padding: scaleWidth(160),
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: scaleHeight(20),
  },
  searchButton: {
    paddingVertical: scaleHeight(14),
    paddingHorizontal: scaleWidth(32),
    borderRadius: 999,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: '#1f1f28',
  },
  searchButtonFocused: {
    borderColor: '#8f8ea3',
  },
  searchLabel: {
    color: '#FFFFFF',
    fontSize: scaleFontSize(22),
    fontWeight: '600',
  },
});
