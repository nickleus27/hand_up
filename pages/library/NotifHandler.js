import PushNotification from 'react-native-push-notification';
import {Platform} from 'react-native'
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import FireTime from './FireTime';
//import {navigate} from './RootNavigation';

export function setupPushNotification(handleNotification){
//NEED TO CONFIGURE CORRECTLY FOR ANDROID AND IOS
// Must be outside of any component LifeCycle (such as `componentDidMount`).
PushNotification.configure({
  /*
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function (token) {
    console.log("TOKEN:", token);
  },
*/

  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
    console.log("NOTIFICATION and configure are working:", notification);

    let notificationID;
    if(Platform.OS === 'android'){//android
      notificationID = JSON.stringify(parseInt(notification.id));
    }else{//ios
      notificationID = JSON.stringify(parseInt(notification.data.id));
    }
    
    handleNotification(notificationID);
    

    if(Platform.OS === 'android' && notification.repeatType === ""){//android notification
      PushNotification.localNotificationSchedule({
        id: notification.id,
        channelId: "soup_kitchen_resources",
        data: {hour: notification.data.hour, week_day: notification.data.week_day,},
        message: notification.message, // (required)
        date:  new Date(Date.now() + FireTime.timeFire(notification.data.hour, notification.data.week_day)),//new Date(Date.now() + (1000)),//new Date(Date.now() + FireTime.timeFire(resource.hour)-timeAhead), // sets to fire on time of event <------need to set an hour in advance-----###
        allowWhileIdle: true, // (optional) set notification to work while on doze, default: false
        /* Android Only Properties */
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
          fireDate: new Date(Date.now() + FireTime.timeFire(notification.data.hour, notification.data.week_day)),
          repeats: notification.data.repeats,
        });
    }

    // (required) Called when a remote is received or opened, or local notification is opened
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  /*
  // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
  onAction: function (notification) {
    console.log("ACTION:", notification.action);
    console.log("NOTIFICATION:", notification);

    // process the action
  },
  */
/*
  // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  onRegistrationError: function(err) {
    console.error(err.message, err);
  },
  */

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   * - if you are not using remote notification or do not have Firebase installed, use this:
   *     requestPermissions: Platform.OS === 'ios'
   */
  
  
   requestPermissions: Platform.OS === 'ios',
});

}