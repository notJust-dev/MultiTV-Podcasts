import {View, Text, StyleSheet, ScrollView, ActivityIndicator} from 'react-native'
import {scaleFontSize, scaleWidth} from '../utils/scaling'
import {PodcastCard} from './PodcastCard'
import {useTrending} from '../context/PodcastIndexContext'

interface TrendingCarouselProps {
    onPodcastPress?: (id: string | number) => void;
}

export default function TrendingCarousel({onPodcastPress}: TrendingCarouselProps) {
    const {data: podcasts, loading, error} = useTrending(20);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Trending Podcasts</Text>

            {loading ? (
                <ActivityIndicator color="#FFFFFF" size="large" />
            ) : error ? (
                <Text style={styles.error}>Failed to load: {error.message}</Text>
            ) : (
                <ScrollView horizontal>
                    {(podcasts ?? []).map(podcast => (
                        <View key={podcast.id} style={styles.listItem}>
                            <PodcastCard
                                podcast={podcast}
                                onPress={p => onPodcastPress?.(p.id)}
                            />
                        </View>
                    ))}
                </ScrollView>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: scaleWidth(20)
    },
    title: {
        color: '#FFFFFF',
        fontSize: scaleFontSize(80),
        lineHeight: scaleFontSize(70),
        fontWeight: 'bold',
        width: scaleWidth(700),
    },
    listItem: {
        width: scaleWidth(400)
    },
    error: {
        color: '#ff8080',
        fontSize: scaleFontSize(22),
    },
})
