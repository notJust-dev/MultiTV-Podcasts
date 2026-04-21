import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {AudioPlayer} from '@amazon-devices/react-native-w3cmedia/dist/interface/AudioPlayer';
import {PlayerScreen, PlayerState} from '@multitv/shared';

import episodes from '../../../shared/src/data/episodes.json';

const noop = () => undefined;

interface PlayerScreenContainerProps {
  episodeId: string | number;
}

export function PlayerScreenContainer({episodeId}: PlayerScreenContainerProps) {
  const playerRef = useRef<AudioPlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  const src = useMemo(() => {
    const ep = (episodes.items as any[]).find(
      e => String(e.id) === String(episodeId),
    );
    return ep?.enclosureUrl as string | undefined;
  }, [episodeId]);

  useEffect(() => {
    if (!src) return;

    const player = new AudioPlayer();
    playerRef.current = player;
    let cancelled = false;

    const syncFromPlayer = () => {
      if (typeof player.duration === 'number' && !isNaN(player.duration)) {
        setDuration(player.duration);
      }
      if (typeof player.currentTime === 'number') {
        setPosition(player.currentTime);
      }
      if (typeof player.paused === 'boolean') {
        setIsPlaying(!player.paused);
      }
    };

    const onPlay = () => {
      setIsPlaying(true);
      setIsLoading(false);
    };
    const onPlaying = () => {
      setIsPlaying(true);
      setIsLoading(false);
    };
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);
    const onTimeUpdate = () => {
      setPosition(player.currentTime ?? 0);
      setIsLoading(false);
    };
    const onDurationChange = () => setDuration(player.duration ?? 0);
    const onLoadedMetadata = () => {
      setDuration(player.duration ?? 0);
      setIsLoading(false);
    };
    const onCanPlay = () => setIsLoading(false);
    const onWaiting = () => setIsLoading(true);
    const onError = () => setIsLoading(false);

    player.addEventListener('play', onPlay);
    player.addEventListener('playing', onPlaying);
    player.addEventListener('pause', onPause);
    player.addEventListener('ended', onEnded);
    player.addEventListener('timeupdate', onTimeUpdate);
    player.addEventListener('durationchange', onDurationChange);
    player.addEventListener('loadedmetadata', onLoadedMetadata);
    player.addEventListener('canplay', onCanPlay);
    player.addEventListener('waiting', onWaiting);
    player.addEventListener('error', onError);

    (async () => {
      try {
        await player.initialize();
        if (cancelled) return;
        player.autoplay = true;
        player.src = src;
        const p = player.play?.();
        if (p && typeof p.catch === 'function') p.catch(noop);
        syncFromPlayer();
      } catch (e) {
        console.warn('[Player] failed to initialize', e);
        setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      player.removeEventListener('play', onPlay);
      player.removeEventListener('playing', onPlaying);
      player.removeEventListener('pause', onPause);
      player.removeEventListener('ended', onEnded);
      player.removeEventListener('timeupdate', onTimeUpdate);
      player.removeEventListener('durationchange', onDurationChange);
      player.removeEventListener('loadedmetadata', onLoadedMetadata);
      player.removeEventListener('canplay', onCanPlay);
      player.removeEventListener('waiting', onWaiting);
      player.removeEventListener('error', onError);
      playerRef.current = null;
      player.deinitialize().catch(noop);
    };
  }, [src]);

  const togglePlayPause = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    if (player.paused) {
      player.play();
    } else {
      player.pause();
    }
  }, []);

  const seekBy = useCallback((seconds: number) => {
    const player = playerRef.current;
    if (!player) return;
    const next = Math.max(
      0,
      Math.min((player.currentTime ?? 0) + seconds, player.duration ?? 0),
    );
    player.currentTime = next;
    setPosition(next);
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
