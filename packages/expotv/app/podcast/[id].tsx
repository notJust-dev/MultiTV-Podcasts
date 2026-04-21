import {Href, useLocalSearchParams, useRouter} from 'expo-router';
import {PodcastDetailsScreen} from '@multitv/shared';

export default function PodcastDetailsRoute() {
  const {id} = useLocalSearchParams<{id: string}>();
  const router = useRouter();
  return (
    <PodcastDetailsScreen
      podcastId={id}
      onEpisodePress={episodeId =>
        router.push({
          pathname: '/player/[episodeId]',
          params: {episodeId: String(episodeId)},
        } as unknown as Href)
      }
    />
  );
}
