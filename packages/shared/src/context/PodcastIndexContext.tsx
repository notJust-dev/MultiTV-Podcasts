import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  createPodcastIndexClient,
  DigestSHA1,
  PodcastIndexClient,
} from '../services/podcastIndex';
import type {Episode, Feed} from '../types';

const PodcastIndexContext = createContext<PodcastIndexClient | null>(null);

interface PodcastIndexProviderProps {
  digestSHA1: DigestSHA1;
  apiKey?: string;
  apiSecret?: string;
  baseUrl?: string;
  userAgent?: string;
  children: ReactNode;
}

export function PodcastIndexProvider({
  digestSHA1,
  apiKey,
  apiSecret,
  baseUrl,
  userAgent,
  children,
}: PodcastIndexProviderProps) {
  const client = useMemo(
    () =>
      createPodcastIndexClient({
        digestSHA1,
        apiKey,
        apiSecret,
        baseUrl,
        userAgent,
      }),
    [digestSHA1, apiKey, apiSecret, baseUrl, userAgent],
  );

  return (
    <PodcastIndexContext.Provider value={client}>
      {children}
    </PodcastIndexContext.Provider>
  );
}

export function usePodcastIndex(): PodcastIndexClient {
  const client = useContext(PodcastIndexContext);
  if (!client) {
    throw new Error(
      'usePodcastIndex must be used inside <PodcastIndexProvider>',
    );
  }
  return client;
}

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

function useAsync<T>(
  fn: () => Promise<T>,
  deps: ReadonlyArray<unknown>,
): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    setState({data: null, loading: true, error: null});
    fn()
      .then(data => {
        if (!cancelled) setState({data, loading: false, error: null});
      })
      .catch(error => {
        if (!cancelled)
          setState({data: null, loading: false, error: error as Error});
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}

export function useTrending(max = 20) {
  const client = usePodcastIndex();
  return useAsync<Feed[]>(() => client.fetchTrending(max), [client, max]);
}

export function useFeedById(id: string | number | undefined) {
  const client = usePodcastIndex();
  return useAsync<Feed | null>(
    () => (id !== undefined ? client.fetchFeedById(id) : Promise.resolve(null)),
    [client, id],
  );
}

export function useEpisodesByFeedId(
  id: string | number | undefined,
  max = 30,
) {
  const client = usePodcastIndex();
  return useAsync<Episode[]>(
    () =>
      id !== undefined
        ? client.fetchEpisodesByFeedId(id, max)
        : Promise.resolve([]),
    [client, id, max],
  );
}

export function useEpisodeById(id: string | number | undefined) {
  const client = usePodcastIndex();
  return useAsync<Episode | null>(
    () =>
      id !== undefined
        ? client.fetchEpisodeById(id)
        : Promise.resolve(null),
    [client, id],
  );
}

export function useSearchPodcasts(term: string, max = 20) {
  const client = usePodcastIndex();
  return useAsync<Feed[]>(
    () => (term ? client.searchPodcasts(term, max) : Promise.resolve([])),
    [client, term, max],
  );
}
