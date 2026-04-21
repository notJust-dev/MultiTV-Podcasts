import {useCallback, useEffect, useRef, useState} from 'react';
import {Audio, AVPlaybackStatus} from 'expo-av';
import {useLocalSearchParams} from 'expo-router';

import {PlayerScreen, PlayerState} from '@multitv/shared';
import episodes from '../../../shared/src/data/episodes.json';

export default function PlayerRoute() {
  const {episodeId} = useLocalSearchParams<{episodeId: string}>();
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const ep = (episodes.items as any[]).find(
      e => String(e.id) === String(episodeId),
    );
    const url = ep?.enclosureUrl as string | undefined;
    if (!url) return;

    let cancelled = false;

    const onStatus = (status: AVPlaybackStatus) => {
      if (!status.isLoaded) {
        setIsLoading(true);
        return;
      }
      setIsLoading(status.isBuffering);
      setIsPlaying(status.isPlaying);
      setPosition((status.positionMillis ?? 0) / 1000);
      setDuration((status.durationMillis ?? 0) / 1000);
    };

    (async () => {
      const {sound} = await Audio.Sound.createAsync(
        {uri: url},
        {shouldPlay: true},
        onStatus,
      );
      if (cancelled) {
        await sound.unloadAsync();
        return;
      }
      soundRef.current = sound;
    })();

    return () => {
      cancelled = true;
      const sound = soundRef.current;
      soundRef.current = null;
      if (sound) {
        sound.unloadAsync().catch(() => {});
      }
    };
  }, [episodeId]);

  const togglePlayPause = useCallback(async () => {
    const sound = soundRef.current;
    if (!sound) return;
    const status = await sound.getStatusAsync();
    if (!status.isLoaded) return;
    if (status.isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  }, []);

  const seekBy = useCallback(async (seconds: number) => {
    const sound = soundRef.current;
    if (!sound) return;
    const status = await sound.getStatusAsync();
    if (!status.isLoaded) return;
    const next = Math.max(
      0,
      Math.min(
        (status.positionMillis ?? 0) + seconds * 1000,
        status.durationMillis ?? 0,
      ),
    );
    await sound.setPositionAsync(next);
  }, []);

  const player: PlayerState = {
    isPlaying,
    isLoading,
    position,
    duration,
    togglePlayPause,
    seekBy,
  };

  return <PlayerScreen episodeId={episodeId} player={player} />;
}
