import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { scaleFontSize, scaleWidth } from '../utils/scaling'
import { PodcastCard } from './PodcastCard'
import podcasts from '../data/trending.json'

export default function TrendingCarousel() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Trending Podcasts</Text>

            <ScrollView horizontal>
                {podcasts.feeds.map((podcast: any) => (
                    <View key={podcast.id} style={styles.listItem}>
                        <PodcastCard key={podcast.id} podcast={podcast} />
                    </View>
                ))}
            </ScrollView>
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
    }
})