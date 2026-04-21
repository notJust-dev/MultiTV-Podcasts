import {View, Text, Image, Pressable, StyleSheet} from 'react-native';
import {scaleFontSize, scaleWidth} from '../utils/scaling';
import {useState} from 'react';

interface PodcastCardProps {
  podcast: {
    id: string;
    title: string;
    author: string;
    artwork?: string;
    image?: string;
  };
}

export function PodcastCard({podcast}: PodcastCardProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Pressable
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={[styles.container, isFocused && styles.focusedContainer]}
      onPress={() => {
        console.log('podcast pressed: ', podcast.title);
      }}>
      <Image
        style={styles.image}
        source={{uri: podcast.artwork || podcast.image}}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {podcast.title}
        </Text>
        <Text style={styles.author} numberOfLines={1}>
          {podcast.author}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: scaleWidth(10),
    transform: [{scale: 0.9}],
  },
  focusedContainer: {
    transform: [{scale: 1}],
    borderWidth: 2,
    borderColor: '#8f8ea3',
    borderRadius: 16,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
  },
  textContainer: {
    gap: scaleWidth(10),
    padding: scaleWidth(10),
  },
  title: {
    fontSize: scaleFontSize(24),
    fontWeight: '500',
    color: '#FFFFFF',
  },
  author: {
    fontSize: scaleFontSize(20),
    color: 'lightgray',
  },
});
