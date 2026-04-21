import React from 'react';
import {ImageBackground} from 'react-native';
import {
  enableFreeze,
  enableScreens,
} from '@amazon-devices/react-native-screens';
import {createNativeStackNavigator} from '@amazon-devices/react-navigation__native-stack';
import {NavigationContainer} from '@amazon-devices/react-navigation__native';
import {HomeScreen} from '@multitv/shared';

enableScreens();
enableFreeze();

const Stack = createNativeStackNavigator();

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
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      </ImageBackground>
    </NavigationContainer>
  );
};
