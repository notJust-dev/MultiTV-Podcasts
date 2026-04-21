import {Href, useRouter} from 'expo-router';
import {SearchScreen} from '@multitv/shared';

export default function SearchRoute() {
  const router = useRouter();
  return (
    <SearchScreen
      onPodcastPress={id =>
        router.push({
          pathname: '/podcast/[id]',
          params: {id: String(id)},
        } as unknown as Href)
      }
    />
  );
}
