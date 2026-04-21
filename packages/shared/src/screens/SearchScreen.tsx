import {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import {scaleFontSize, scaleHeight, scaleWidth} from '../utils/scaling';
import {PodcastCard} from '../components/PodcastCard';
import {useSearchPodcasts} from '../context/PodcastIndexContext';

interface SearchScreenProps {
  onPodcastPress?: (id: string | number) => void;
}

export function SearchScreen({onPodcastPress}: SearchScreenProps) {
  const [text, setText] = useState('');
  const [term, setTerm] = useState('');

  useEffect(() => {
    const handle = setTimeout(() => setTerm(text.trim()), 350);
    return () => clearTimeout(handle);
  }, [text]);

  const {data: results, loading, error} = useSearchPodcasts(term, 30);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search</Text>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Search podcasts..."
        placeholderTextColor="#8f8ea3"
        autoFocus
        returnKeyType="search"
      />

      {loading ? (
        <ActivityIndicator
          color="#FFFFFF"
          size="large"
          style={styles.feedback}
        />
      ) : error ? (
        <Text style={[styles.feedback, styles.error]}>
          Failed to search: {error.message}
        </Text>
      ) : !term ? (
        <Text style={[styles.feedback, styles.hint]}>
          Start typing to search podcasts.
        </Text>
      ) : (results?.length ?? 0) === 0 ? (
        <Text style={[styles.feedback, styles.hint]}>
          No results for "{term}".
        </Text>
      ) : (
        <FlatList
          data={results ?? []}
          keyExtractor={item => String(item.id)}
          numColumns={3}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.grid}
          renderItem={({item}) => (
            <View style={styles.gridItem}>
              <PodcastCard
                podcast={item}
                onPress={p => onPodcastPress?.(p.id)}
              />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: scaleWidth(160),
    backgroundColor: 'black',
    gap: scaleHeight(24),
  },
  title: {
    color: '#FFFFFF',
    fontSize: scaleFontSize(80),
    lineHeight: scaleFontSize(80),
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 2,
    borderColor: '#8f8ea3',
    borderRadius: 16,
    paddingVertical: scaleHeight(16),
    paddingHorizontal: scaleWidth(24),
    color: '#FFFFFF',
    fontSize: scaleFontSize(28),
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  feedback: {
    marginTop: scaleHeight(40),
  },
  hint: {
    color: 'lightgray',
    fontSize: scaleFontSize(22),
  },
  error: {
    color: '#ff8080',
    fontSize: scaleFontSize(22),
  },
  grid: {
    paddingTop: scaleHeight(20),
    paddingBottom: scaleHeight(80),
    gap: scaleHeight(20),
  },
  row: {
    gap: scaleWidth(20),
  },
  gridItem: {
    flex: 1,
    maxWidth: scaleWidth(400),
  },
});
