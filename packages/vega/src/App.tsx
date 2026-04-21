import React from 'react';
import {ImageBackground} from 'react-native';
import {
  enableFreeze,
  enableScreens,
} from '@amazon-devices/react-native-screens';
import {createNativeStackNavigator} from '@amazon-devices/react-navigation__native-stack';
import {NavigationContainer} from '@amazon-devices/react-navigation__native';
import {HomeScreen, PodcastDetailsScreen} from '@multitv/shared';
import {PlayerScreenContainer} from './screens/PlayerScreenContainer';

enableScreens();
enableFreeze();

type RootStackParamList = {
  Home: undefined;
  PodcastDetails: {id: string | number};
  Player: {episodeId: string | number};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const App = () => {
  return (
    <NavigationContainer>
      <ImageBackground
        source={require('./assets/background.png')}
        style={{flex: 1}}>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="Home">
            {({navigation}) => (
              <HomeScreen
                onPodcastPress={id =>
                  navigation.navigate('PodcastDetails', {id})
                }
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="PodcastDetails">
            {({route, navigation}) => (
              <PodcastDetailsScreen
                podcastId={route.params.id}
                onEpisodePress={episodeId =>
                  navigation.navigate('Player', {episodeId})
                }
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Player">
            {({route}) => (
              <PlayerScreenContainer episodeId={route.params.episodeId} />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </ImageBackground>
    </NavigationContainer>
  );
};
