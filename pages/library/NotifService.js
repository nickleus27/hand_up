import PushNotification from 'react-native-push-notification';
import {Platform} from 'react-native'
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { setupPushNotification } from './NotifHandler';
import FireTime from './FireTime';


export default class NotifService {
    constructor(){//{navigation}){
        this.pushNotification = setupPushNotification();//this.handleNotificationOpen({navigation}));
    }
    triggerNotificationHandler = (resource)=>{ //, notifID) => {
        console.log(resource);
        //ADD PARAMETER FOR OPTION OF CHOOSING START TIME
        
        //this is a time in miliseconds that notification should start prior to date
        const timeAhead = 3600000;//1 hour ahead start time
        
        
        
        //NEED TO SET THIS UP LIKE THE ELSE STATEMENT BELOW FOR ANDROID
        //NEED SET UP FOR NON DAILY REPEATING NOTIFICATIONS
        if(Platform.OS === 'ios'){//ios notifications
            PushNotificationIOS.addNotificationRequest({
              id: resource.row_id.toString(),//notifID,
              userInfo: {id: resource.row_id.toString(), hour: resource.hour, week_day: resource.week_day, },
              title: 'Hand Up',
              body: messageString(resource),
              category: 'Hand Up',
              fireDate: new Date(Date.now() + FireTime.timeFire(resource.hour, resource.week_day)-timeAhead),
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
              date: new Date(Date.now() + FireTime.timeFire(resource.hour, resource.week_day)-timeAhead), //timeFire returns milliseconds until date, and timeAhead is milliseconds prior to date
              allowWhileIdle: true, // (optional) set notification to work while on doze, default: false
            
              /* Android Only Properties */
              repeatType: (FireTime.isEveryday(resource.week_day)) ? "day" : "", // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
            });
        }
    };
    triggerCancelNotifHandler = (notifID) =>{


            //ADD IOS VERSION HERE <--------------##### THESE METHODS WONT WORK ON IOS...PUSHNOTIFICAITIONIOS
        
            /*
            PushNotification.getScheduledLocalNotifications((notifs)=>{
              console.log(notifs);
             })
             */
        console.log('i am in cancelNotifHandler ' + notifID);
        
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
            PushNotification.cancelLocalNotifications({id: notifID});
            PushNotification.getScheduledLocalNotifications((notifs)=>{
                console.log(notifs);
            });
        }
    };
    messageString = (resource)=>{
        return (resource.org_name + ' is open '+resource.week_day + ' from ' + resource.hour);
    };

    handleNotificationOpen = ({navigation}) => {
        navigation.navigate('ViewResource');
    }
}