import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import {scaleFontSize, scaleHeight, scaleWidth} from '../utils/scaling';
import {EpisodeItem} from '../components/EpisodeItem';
import {
  useEpisodesByFeedId,
  useFeedById,
} from '../context/PodcastIndexContext';

interface PodcastDetailsScreenProps {
  podcastId: string | number;
  onEpisodePress?: (id: string | number) => void;
}

function stripHtml(input: string): string {
  return input
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

export function PodcastDetailsScreen({
  podcastId,
  onEpisodePress,
}: PodcastDetailsScreenProps) {
  const {data: podcast, loading: loadingFeed, error: feedError} =
    useFeedById(podcastId);
  const {data: episodes, loading: loadingEpisodes, error: episodesError} =
    useEpisodesByFeedId(podcastId, 50);

  if (loadingFeed && !podcast) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator color="#FFFFFF" size="large" />
      </View>
    );
  }

  if (feedError || !podcast) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.title}>Podcast not found</Text>
        <Text style={styles.meta}>id: {String(podcastId)}</Text>
        {feedError ? (
          <Text style={styles.meta}>{feedError.message}</Text>
        ) : null}
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={episodes ?? []}
      keyExtractor={item => String(item.id)}
      ListHeaderComponent={
        <View style={styles.headerBlock}>
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
          <Text style={styles.description} numberOfLines={4}>
            {stripHtml(podcast.description)}
          </Text>

          <Text style={styles.sectionTitle}>Episodes</Text>
          {loadingEpisodes ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : episodesError ? (
            <Text style={styles.error}>
              Failed to load episodes: {episodesError.message}
            </Text>
          ) : null}
        </View>
      }
      renderItem={({item}) => (
        <EpisodeItem
          episode={item}
          onPress={e => onEpisodePress?.(e.id)}
        />
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: scaleWidth(160),
    backgroundColor: 'black',
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: scaleHeight(12),
  },
  content: {
    paddingBottom: scaleHeight(80),
  },
  headerBlock: {
    gap: scaleHeight(40),
    marginBottom: scaleHeight(40),
  },
  header: {
    flexDirection: 'row',
    gap: scaleWidth(40),
  },
  separator: {
    height: scaleHeight(12),
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
  error: {
    color: '#ff8080',
    fontSize: scaleFontSize(22),
  },
});
