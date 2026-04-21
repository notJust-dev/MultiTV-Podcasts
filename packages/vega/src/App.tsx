import React from 'react';
import {ImageBackground} from 'react-native';
import {
  enableFreeze,
  enableScreens,
} from '@amazon-devices/react-native-screens';
import {createNativeStackNavigator} from '@amazon-devices/react-navigation__native-stack';
import {NavigationContainer} from '@amazon-devices/react-navigation__native';
import {HomeScreen, PodcastDetailsScreen} from '@multitv/shared';

enableScreens();
enableFreeze();

type RootStackParamList = {
  Home: undefined;
  PodcastDetails: {id: string | number};
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
            {({route}) => (
              <PodcastDetailsScreen podcastId={route.params.id} />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </ImageBackground>
    </NavigationContainer>
  );
};
