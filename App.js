// Pre-Populated SQLite Database in React Native
// https://aboutreact.com/example-of-pre-populated-sqlite-database-in-react-native
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

import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification, {Importance} from 'react-native-push-notification';

//import FireTime from './pages/library/FireTime';

const Stack = createStackNavigator();

/*<-------------### 4 
//NEED TO CONFIGURE CORRECTLY FOR ANDROID AND IOS
//NEED TO BE ABLE TO CALCULATE THE CORRECT NEXT FIRE TIME
// Must be outside of any component LifeCycle (such as `componentDidMount`).
PushNotification.configure({
  
  // (optional) Called when Token is generated (iOS and Android)
 // onRegister: function (token) {
 //   console.log("TOKEN:", token);
 // },

userInteraction: false,
  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
    console.log("NOTIFICATION and configure are working:", notification);
    console.log("this is data object " + notification.data.hour + " and " + notification.data.week_day);
    console.log('this is id ' + notification.id)
    //------------------>handlelNotification(notification)
    const timeAhead = 3600000;//1 hour ahead start time

    //NEED TO SET UP FOR IOS<--------------###
    if(Platform.OS === 'android' && notification.repeatType === ""){//android notification
      //this is only a test notification<--------------###
      PushNotification.localNotificationSchedule({
        id: notification.id,
        channelId: "soup_kitchen_resources",
        data: {hour: notification.data.hour, week_day: notification.data.week_day,},
        message: notification.message, // (required)
        date:  new Date(Date.now() + FireTime.timeFire(notification.data.hour, notification.data.week_day)-timeAhead),//new Date(Date.now() + (1000)),//new Date(Date.now() + FireTime.timeFire(resource.hour)-timeAhead), // sets to fire on time of event <------need to set an hour in advance-----###
        allowWhileIdle: true, // (optional) set notification to work while on doze, default: false
        //userInteraction: false,//??? not working
        // Android Only Properties 
        repeatType: "", // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
      });
    }
    if(Platform.OS === 'ios' && notification.data.repeats == false){//ios notifications
        PushNotificationIOS.addNotificationRequest({
          id: notification.data.id,//notifID,
          userInfo: {id: notification.data.id, hour: notification.data.hour, week_day: notification.data.week_day, },
          title: 'Hand Up',
          body: notification.message,
          category: 'Hand Up',
          fireDate: new Date(Date.now() + FireTime.timeFire(notification.data.hour, notification.data.week_day)-timeAhead),
          repeats: notification.data.repeats,
        });
    }
    // process the notification

    // (required) Called when a remote is received or opened, or local notification is opened
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  
  // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
  //onAction: function (notification) {
    //console.log("ACTION:", notification.action);
    //console.log("NOTIFICATION:", notification);

    // process the action
  //},
  
  // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  //onRegistrationError: function(err) {
    //console.error(err.message, err);
  //},

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,


   // - if you are not using remote notification or do not have Firebase installed, use this:
   //    requestPermissions: Platform.OS === 'ios'
  
   requestPermissions: Platform.OS === 'ios',
});
*/



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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;