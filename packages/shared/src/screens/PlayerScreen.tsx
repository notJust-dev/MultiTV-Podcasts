import {ReactNode} from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import {scaleFontSize, scaleHeight, scaleWidth} from '../utils/scaling';
import type {Episode, Feed} from '../types';

export interface PlayerState {
  isPlaying: boolean;
  isLoading: boolean;
  position: number;
  duration: number;
  togglePlayPause: () => void;
  seekBy: (seconds: number) => void;
}

interface PlayerScreenProps {
  episode: Episode | null;
  podcast?: Feed | null;
  loading?: boolean;
  error?: Error | null;
  player: PlayerState;
  children?: ReactNode;
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const mm = h > 0 ? String(m).padStart(2, '0') : String(m);
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function PlayerScreen({
  episode,
  podcast,
  loading,
  error,
  player,
  children,
}: PlayerScreenProps) {
  if (loading && !episode) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator color="#FFFFFF" size="large" />
      </View>
    );
  }

  if (error || !episode) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.title}>Episode not available</Text>
        {error ? <Text style={styles.podcast}>{error.message}</Text> : null}
      </View>
    );
  }

  const artworkUri =
    episode.image || episode.feedImage || podcast?.artwork || podcast?.image;

  const progress = player.duration > 0 ? player.position / player.duration : 0;

  return (
    <View style={styles.container}>
      {children}
      <View style={styles.artworkWrap}>
        {artworkUri ? (
          <Image style={styles.artwork} source={{uri: artworkUri}} />
        ) : (
          <View style={[styles.artwork, styles.artworkPlaceholder]} />
        )}
      </View>

      <View style={styles.meta}>
        <Text style={styles.title} numberOfLines={2}>
          {episode.title}
        </Text>
        {podcast ? (
          <Text style={styles.podcast} numberOfLines={1}>
            {podcast.title}
          </Text>
        ) : null}
      </View>

      <View style={styles.progressWrap}>
        <View style={styles.progressTrack}>
          <View
            style={[styles.progressFill, {width: `${progress * 100}%`}]}
          />
        </View>
        <View style={styles.timeRow}>
          <Text style={styles.time}>{formatTime(player.position)}</Text>
          <Text style={styles.time}>{formatTime(player.duration)}</Text>
        </View>
      </View>

      <View style={styles.controls}>
        <PlayerButton label="-10s" onPress={() => player.seekBy(-10)} />
        <PlayerButton
          label={
            player.isLoading ? '…' : player.isPlaying ? 'Pause' : 'Play'
          }
          primary
          onPress={player.togglePlayPause}
        />
        <PlayerButton label="+30s" onPress={() => player.seekBy(30)} />
      </View>
    </View>
  );
}

interface PlayerButtonProps {
  label: string;
  onPress: () => void;
  primary?: boolean;
}

function PlayerButton({label, onPress, primary}: PlayerButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({focused}) => [
        styles.button,
        primary && styles.buttonPrimary,
        focused && styles.buttonFocused,
      ]}>
      <Text style={[styles.buttonLabel, primary && styles.buttonLabelPrimary]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: scaleWidth(160),
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scaleHeight(40),
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  artworkWrap: {
    alignItems: 'center',
  },
  artwork: {
    width: scaleWidth(400),
    height: scaleWidth(400),
    borderRadius: 24,
  },
  artworkPlaceholder: {
    backgroundColor: '#222',
  },
  meta: {
    alignItems: 'center',
    gap: scaleHeight(12),
  },
  title: {
    color: '#FFFFFF',
    fontSize: scaleFontSize(40),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  podcast: {
    color: 'lightgray',
    fontSize: scaleFontSize(24),
  },
  progressWrap: {
    width: scaleWidth(800),
    gap: scaleHeight(8),
  },
  progressTrack: {
    height: scaleHeight(6),
    backgroundColor: '#333',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  time: {
    color: 'lightgray',
    fontSize: scaleFontSize(18),
  },
  controls: {
    flexDirection: 'row',
    gap: scaleWidth(24),
  },
  button: {
    paddingVertical: scaleHeight(16),
    paddingHorizontal: scaleWidth(32),
    borderRadius: 999,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: '#1f1f28',
  },
  buttonPrimary: {
    backgroundColor: '#FFFFFF',
  },
  buttonFocused: {
    borderColor: '#8f8ea3',
  },
  buttonLabel: {
    color: '#FFFFFF',
    fontSize: scaleFontSize(22),
    fontWeight: '600',
  },
  buttonLabelPrimary: {
    color: 'black',
  },
});
