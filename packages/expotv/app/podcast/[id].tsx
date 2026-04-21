import {useLocalSearchParams} from 'expo-router';
import {PodcastDetailsScreen} from '@multitv/shared';

export default function PodcastDetailsRoute() {
  const {id} = useLocalSearchParams<{id: string}>();
  return <PodcastDetailsScreen podcastId={id} />;
}
