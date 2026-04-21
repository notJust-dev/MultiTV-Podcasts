import {useState} from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';

import {scaleFontSize, scaleHeight, scaleWidth} from '../utils/scaling';
import type {Episode} from '../types';

interface EpisodeItemProps {
  episode: Pick<
    Episode,
    'id' | 'title' | 'datePublishedPretty' | 'duration' | 'episode' | 'season'
  >;
  onPress?: (episode: EpisodeItemProps['episode']) => void;
}

function formatDuration(seconds: number | null | undefined): string {
  if (!seconds) return '';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function EpisodeItem({episode, onPress}: EpisodeItemProps) {
  const [isFocused, setIsFocused] = useState(false);

  const prefix = [
    episode.season ? `S${episode.season}` : null,
    episode.episode ? `E${episode.episode}` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <Pressable
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onPress={() => onPress?.(episode)}
      style={[styles.container, isFocused && styles.focusedContainer]}>
      <View style={styles.row}>
        {prefix ? <Text style={styles.prefix}>{prefix}</Text> : null}
        <Text style={styles.title} numberOfLines={1}>
          {episode.title}
        </Text>
      </View>
      <View style={styles.metaRow}>
        <Text style={styles.meta}>{episode.datePublishedPretty}</Text>
        {episode.duration ? (
          <Text style={styles.meta}>· {formatDuration(episode.duration)}</Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: scaleHeight(20),
    paddingHorizontal: scaleWidth(24),
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    gap: scaleHeight(8),
  },
  focusedContainer: {
    borderColor: '#8f8ea3',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaleWidth(16),
  },
  prefix: {
    color: '#8f8ea3',
    fontSize: scaleFontSize(20),
    fontWeight: '600',
  },
  title: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: scaleFontSize(26),
    fontWeight: '500',
  },
  metaRow: {
    flexDirection: 'row',
    gap: scaleWidth(12),
  },
  meta: {
    color: 'lightgray',
    fontSize: scaleFontSize(18),
  },
});
