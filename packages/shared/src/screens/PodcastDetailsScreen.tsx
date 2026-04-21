import {View, Text, Image, StyleSheet, ScrollView} from 'react-native';

import {scaleFontSize, scaleHeight, scaleWidth} from '../utils/scaling';
import podcasts from '../data/trending.json';

interface PodcastDetailsScreenProps {
  podcastId: string | number;
}

export function PodcastDetailsScreen({podcastId}: PodcastDetailsScreenProps) {
  const podcast = podcasts.feeds.find(
    (feed: any) => String(feed.id) === String(podcastId),
  );

  if (!podcast) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Podcast not found</Text>
        <Text style={styles.meta}>id: {String(podcastId)}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Image
          style={styles.artwork}
          source={{uri: podcast.artwork || podcast.image}}
        />
        <View style={styles.headerText}>
          <Text style={styles.title} numberOfLines={2}>
            {podcast.title}
          </Text>
          <Text style={styles.author} numberOfLines={1}>
            {podcast.author}
          </Text>
          <Text style={styles.meta}>id: {String(podcast.id)}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>About</Text>
      <Text style={styles.description}>{podcast.description}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: scaleWidth(160),
    backgroundColor: 'black',
  },
  content: {
    gap: scaleHeight(40),
  },
  header: {
    flexDirection: 'row',
    gap: scaleWidth(40),
  },
  artwork: {
    width: scaleWidth(400),
    height: scaleWidth(400),
    borderRadius: 16,
  },
  headerText: {
    flex: 1,
    gap: scaleHeight(16),
    justifyContent: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: scaleFontSize(64),
    fontWeight: 'bold',
  },
  author: {
    color: 'lightgray',
    fontSize: scaleFontSize(32),
  },
  meta: {
    color: '#8f8ea3',
    fontSize: scaleFontSize(20),
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: scaleFontSize(40),
    fontWeight: '600',
  },
  description: {
    color: 'lightgray',
    fontSize: scaleFontSize(24),
    lineHeight: scaleFontSize(34),
  },
});
