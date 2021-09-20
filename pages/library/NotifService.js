import PushNotification from 'react-native-push-notification';
import {Platform} from 'react-native'
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { setupPushNotification } from './NotifHandler';
import {navigate} from './RootNavigation';
import FireTime from './FireTime';


export default class NotifService {
    constructor(){
        this.pushNotification = setupPushNotification(this.handleNotificationOpen);
    }
    triggerNotificationHandler = (resource)=>{ //, notifID) => {
        //ADD PARAMETER FOR OPTION OF CHOOSING START TIME
        
        if(Platform.OS === 'ios'){//ios notifications
            PushNotificationIOS.addNotificationRequest({
              id: resource.row_id.toString(),//notifID,
              userInfo: {repeats: (FireTime.isEveryday(resource.week_day)) ? true : false, id: resource.row_id.toString(), hour: resource.hour, week_day: resource.week_day, },              title: 'Hand Up',
              body: this.messageString(resource),
              category: 'Hand Up',
              fireDate: new Date(Date.now() + FireTime.timeFire(resource.hour, resource.week_day)),
              repeats: (FireTime.isEveryday(resource.week_day)) ? true : false,
            });
        }else{//android notifications
            PushNotification.localNotificationSchedule({
              //TITLE
              //... You can use all the options from localNotifications
              channelId: "soup_kitchen_resources",
              id: resource.row_id.toString(),//notifID,
              data: {hour: resource.hour, week_day: resource.week_day, },//data to travel with notif for onNotification in configure
              message: this.messageString(resource), // (required)
              date: new Date(Date.now() + FireTime.timeFire(resource.hour, resource.week_day)), //timeFire returns milliseconds until date, and timeAhead is milliseconds prior to date
              allowWhileIdle: true, // (optional) set notification to work while on doze, default: false
            
              /* Android Only Properties */
              actions: ["Open",],
              repeatType: (FireTime.isEveryday(resource.week_day)) ? "day" : "", // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
            });
        }
    };
    triggerCancelNotifHandler = (notifID) =>{
        
        if(Platform.OS === 'ios'){//ios cancel notification
            PushNotificationIOS.removePendingNotificationRequests([notifID]);
            PushNotificationIOS.getPendingNotificationRequests((requests) => {
                console.log('Push Notification Received', JSON.stringify(requests), [
                    {
                        text: 'Dismiss',
                        onPress: null,
                    },
                ]);
            });
        }else{//android cancel notification
            PushNotification.cancelLocalNotification({id: notifID});
            PushNotification.getScheduledLocalNotifications((notifs)=>{
                console.log(notifs);
            });
        }
    };

    //message to be displayed in notification
    messageString = (resource)=>{
        return (resource.org_name + ' is open '+resource.week_day + ' from ' + resource.hour);
    };

    //displays scheduled local notifications in console
    scheduledNotifications = () => {

        if(Platform.OS === 'android'){
            PushNotification.getScheduledLocalNotifications((notifs)=>{
                console.log(notifs);
            });
        }else{
            PushNotificationIOS.getPendingNotificationRequests((requests) => {
                console.log('Push Notification Received', JSON.stringify(requests), [
                    {
                        text: 'Dismiss',
                        onPress: null,
                    },
                ]);
            });
        }
    };

    handleNotificationOpen = (notificationID) =>{
        notificationID = JSON.stringify(parseInt(notificationID));
        navigate('SingleResourceView', {id: notificationID});
    }
    
}