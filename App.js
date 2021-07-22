// Pre-Populated SQLite Database in React Native
// https://aboutreact.com/example-of-pre-populated-sqlite-database-in-react-native

import 'react-native-gesture-handler';

import React, {useEffect} from 'react';
import {Platform} from 'react-native'
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import HomeScreen from './pages/HomeScreen';
import ViewAll from './pages/ViewAll';
import ViewResource from './pages/ViewResource';

import PushNotificationIOS from '@react-native-community/push-notification-ios';

const Stack = createStackNavigator();

const App = () => {

  if(Platform.OS == 'ios'){
    useEffect(() => {
      PushNotificationIOS.requestPermissions();
    }, [])
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{
            title: 'Home', //Set Header Title
            headerStyle: {
              backgroundColor: `#7fffd4`, //Set Header color
            },
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'bold', //Set Header text style
            },
          }}
        />
        
        <Stack.Screen
          name="ViewResource"
          component={ViewResource}
          options={{
            title: 'View Resource', //Set Header Title
            headerStyle: {
              backgroundColor: `#7fffd4`, //Set Header color
            },
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'bold', //Set Header text style
            },
          }}
        />
        
        <Stack.Screen
          name="ViewAll"
          component={ViewAll}
          options={{
            title: 'View Resources', //Set Header Title
            headerStyle: {
              backgroundColor: `#7fffd4`, //Set Header color
            },
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'bold', //Set Header text style
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;