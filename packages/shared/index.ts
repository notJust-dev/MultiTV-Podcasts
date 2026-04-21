export {Header} from './src/components/Header/Header';
export {HomeScreen} from './src/screens/HomeScreen';
export {PodcastDetailsScreen} from './src/screens/PodcastDetailsScreen';
export {PlayerScreen} from './src/screens/PlayerScreen';
export type {PlayerState} from './src/screens/PlayerScreen';
export {SearchScreen} from './src/screens/SearchScreen';
export {ApiDemo} from './src/components/ApiDemo';

export {
  scaleFontSize,
  scaleWidth,
  scaleHeight,
} from './src/utils/scaling';

// HTTP Client (fetch-based)
export {createHttpClient} from './src/services/httpClient';
export type {HttpClientConfig, HttpResponse} from './src/services/httpClient';

// Podcast Index service
export {
  PodcastIndexClient,
  createPodcastIndexClient,
} from './src/services/podcastIndex';
export type {
  DigestSHA1,
  PodcastIndexClientConfig,
} from './src/services/podcastIndex';
export {
  PodcastIndexProvider,
  usePodcastIndex,
  useTrending,
  useFeedById,
  useEpisodesByFeedId,
  useEpisodeById,
  useSearchPodcasts,
} from './src/context/PodcastIndexContext';

export type {Feed, Episode} from './src/types';


