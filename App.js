/**Nick Anderson
 * 2021
 * An app that uses SQLite to store a database of Resources for people experiencing
 * houselessness.
 */
"use strict";

import 'react-native-gesture-handler';

import React, {useEffect} from 'react';
import {Platform} from 'react-native'
import {NavigationContainer} from '@react-navigation/native';
import { navigationRef } from './pages/library/RootNavigation';
import {createStackNavigator} from '@react-navigation/stack';

import HomeScreen from './pages/HomeScreen';
import ViewAll from './pages/ViewAll'
import NotifSetting from './pages/NotifSetting';
import ViewResource from './pages/ViewResource';
import SingleResourceView from './pages/SingleResourceView';

import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification, {Importance} from 'react-native-push-notification';

let Stack = createStackNavigator();


//let notif = new NotifService();//does this need to be here.  handleNotifOpened
//doesn't navigate to SingleResourceScreen everytime you click on notification.

//console.log("This is App.js");

const App = () => {

  useEffect(()=>{
    if(Platform.OS === 'ios'){
      PushNotificationIOS.requestPermissions().then(
        (data) => {
          console.log('PushNotificationIOS.requestPermissions', data);
        },
        (data) => {
          console.log('PushNotificationIOS.requestPermissions failed', data);
        },
      );
    }
    if(Platform.OS === 'android'){
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
    }
  }, [])

  return (
    <NavigationContainer ref={navigationRef}>
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

        <Stack.Screen
          name="SingleResourceView"
          component={SingleResourceView}
          options={{
            title: 'Resource Notification', //Set Header Title
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