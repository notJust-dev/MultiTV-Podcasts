import {Href, useRouter} from 'expo-router';
import {HomeScreen} from '@multitv/shared';

export default function App() {
  const router = useRouter();
  return (
    <HomeScreen
      onPodcastPress={id =>
        router.push({
          pathname: '/podcast/[id]',
          params: {id: String(id)},
        } as unknown as Href)
      }
    />
  );
}
