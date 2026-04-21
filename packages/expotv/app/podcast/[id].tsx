import {Href, Stack, useLocalSearchParams, useRouter} from 'expo-router';
import {PodcastDetailsScreen, useFeedById} from '@multitv/shared';

export default function PodcastDetailsRoute() {
  const {id} = useLocalSearchParams<{id: string}>();
  const router = useRouter();
  const {data: feed} = useFeedById(id);

  return (
    <>
      <Stack.Screen options={{title: feed?.title ?? 'Podcast'}} />
      <PodcastDetailsScreen
        podcastId={id}
        onEpisodePress={episodeId =>
          router.push({
            pathname: '/player/[episodeId]',
            params: {episodeId: String(episodeId)},
          } as unknown as Href)
        }
      />
    </>
  );
}
