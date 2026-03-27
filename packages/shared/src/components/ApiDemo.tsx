import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {createHttpClient} from '../services/httpClient';
import {scaleFontSize, scaleWidth, scaleHeight} from '../utils/scaling';

interface Joke {
  id: number;
  setup: string;
  punchline: string;
}

const httpClient = createHttpClient({
  baseUrl: 'http://official-joke-api.appspot.com',
  timeout: 10000,
});

export const ApiDemo = () => {
  const [joke, setJoke] = useState<Joke | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJoke = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await httpClient.get<Joke>('/random_joke');
      if (response.ok) {
        setJoke(response.data);
      } else {
        setError(`Request failed with status ${response.status}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJoke();
  }, [fetchJoke]);

  if (loading) {
    return <ActivityIndicator size="large" color="#FFFFFF" />;
  }

  if (error) {
    return <Text style={styles.description}>{error}</Text>;
  }

  if (joke) {
    return (
      <View style={styles.jokeContainer}>
        <Text style={styles.jokeSetup}>{joke.setup}</Text>
        <Text style={styles.jokePunchline}>{joke.punchline}</Text>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  description: {
    color: '#FFFFFF',
    fontSize: scaleFontSize(60),
    lineHeight: scaleFontSize(80),
    flex: 1,
  },
  jokeContainer: {
    flex: 1,
  },
  jokeSetup: {
    color: '#FFFFFF',
    fontSize: scaleFontSize(60),
    fontWeight: 'bold',
  },
  jokePunchline: {
    color: '#FFFFFF',
    fontSize: scaleFontSize(52),
    marginTop: scaleHeight(16),
  },
});
