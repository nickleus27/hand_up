// Pre-Populated SQLite Database in React Native
// https://aboutreact.com/example-of-pre-populated-sqlite-database-in-react-native

import 'react-native-gesture-handler';

import React, {useEffect} from 'react';
import {Platform} from 'react-native'
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import HomeScreen from './pages/HomeScreen';
import ViewAll from './pages/ViewAll'
import NotifSetting from './pages/NotifSetting';
import ViewResource from './pages/ViewResource';

import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification, {Importance} from 'react-native-push-notification';

const Stack = createStackNavigator();

const App = () => {

  if(Platform.OS == 'ios'){
    useEffect(() => {
      PushNotificationIOS.requestPermissions();
    }, [])
  }

  if(Platform.OS == 'android'){
    useEffect(()=>{
      PushNotification.createChannel(
        {
          channelId: "soup_kitchen_resources", // (required)
          channelName: "Soup Kitchen Resources", // (required)
          channelDescription: "A channel to send soup kitchen notifications", // (optional) default: undefined.
          playSound: true, // (optional) default: true
          soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
          importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
          vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
        },
        (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
      );
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
            title: 'Resources', //Set Header Title
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
          name="NotifSetting"
          component={NotifSetting}
          options={{
            title: 'Notification Settings', //Set Header Title
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