

/****THIS PAGE IS STRICTLY FOR TESTING AND HAS MANY PROBLEMS<-----------###
 ****USING CANCEL ALL NOTIFICATIONS ON THIS PAGE WILL MESS UP APP<-------###
 ****IF USED FOR TESTING WILL NEED TO UNIINSTALL AND REINSTALL APP  <----###
 */
 "use strict";

import React, {useState} from 'react';
import {Text, View, SafeAreaView, Platform} from 'react-native';
import Mytextinput from './components/Mytextinput';
import Mybutton from './components/Mybutton';
import {openDatabase} from 'react-native-sqlite-storage';
import FireTime from './library/FireTime';
//import PushNotification from 'react-native-push-notification';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';


//import checkboxes for notification selection
//import CheckBox from '@react-native-community/checkbox';


// Connction to access the pre-populated user_db.db
const db = openDatabase({name: 'soup_kitchen_sc.db', createFromLocation: 1});
//let notif = new NotifService();

const ViewResource = () => {

  //const [toggleCheckBox, setToggleCheckBox] = useState(false);


  let messageString = (resource) =>{
    return (resource.org_name + ' is open '+resource.week_day + ' from ' + resource.hour);
  };


  const triggerNotificationHandler = (resource) => {
//ADD PARAMETER FOR OPTION OF CHOOSING START TIME
//this is a time in miliseconds that notification should start prior to date
console.log("this is resource id to string " + resource.row_id.toString())

if(Platform.OS === 'ios'){//ios notification
  //this is only a test notification<--------------###
  console.log('i am here in ios')
  PushNotificationIOS.addNotificationRequest({
    id: resource.row_id.toString(),//notifID,
    userInfo: {repeats: (FireTime.isEveryday(resource.week_day)) ? true : false, id: resource.row_id.toString(), hour: resource.hour, week_day: resource.week_day, },
    title: 'Hand Up',
    body: messageString(resource),
    category: 'Hand Up',
    fireDate: new Date(Date.now() + (1000)),
    repeats: (FireTime.isEveryday(resource.week_day)) ? true : false,
  });
}else{//android notification
    PushNotification.localNotificationSchedule({
      id: resource.row_id.toString(),//notifID,
      channelId: "soup_kitchen_resources",
      data: {hour: resource.hour, week_day: resource.week_day, },
      message: messageString(resource), // (required)
      date:  new Date(Date.now() + (1000)),//new Date(Date.now() + FireTime.timeFire(resource.hour)-timeAhead), // sets to fire on time of event <------need to set an hour in advance-----###
      allowWhileIdle: true, // (optional) set notification to work while on doze, default: false
      //userInteraction: false, //HOW TO MAKE NOTIF FIRE WITHOUT CLICKING NOTIF
    
      /* Android Only Properties */

      /*ADDED ACTIONS HERE SINCE LAST COMMIT<-----------------------##*/
      actions: ["Open",],
      repeatType: (FireTime.isEveryday(resource.week_day)) ? "day" : "", // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
    });
  }
   };

//CANCEL ALL NOTIFCATIONS
   const triggerActivNotif = () =>{
     PushNotification.getScheduledLocalNotifications((notifs)=>{
      console.log(notifs);
     })
     PushNotification.cancelAllLocalNotifications();
   };

  let [inputUserId, setInputUserId] = useState('');
  let [userData, setUserData] = useState({});

  let searchUser = () => {
    console.log(inputUserId);
    setUserData({});
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM soup_kitchen_table where row_id = ?',
        [inputUserId],
        (tx, results) => {
          var len = results.rows.length;
          console.log('len', len);
          if (len > 0) {
            let resource = results.rows.item(0);
            setUserData(results.rows.item(0));
            triggerNotificationHandler(resource);
          } else {
            alert('No resource found');
          }
        },
      );
    });
  };

  const scheduledNotifications = () => {

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

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <View style={{flex: 1}}>
          <Mytextinput
            placeholder="Enter resource Id"
            onChangeText={(inputUserId) => setInputUserId(inputUserId)}
            style={{padding: 10}}
          />
          <Mybutton title="Search resource" customClick={searchUser} />
          <Mybutton title="Cancel all active notifications" customClick = {triggerActivNotif} />
          <Mybutton title="Get Scheduled Notifications in console" customClick = {scheduledNotifications} />
          <View
            style={{
              marginLeft: 35,
              marginRight: 35, 
              marginTop: 10
            }}>
            <Text>Id: {userData.row_id}</Text>
            <Text>Organization: {userData.org_name}</Text>
            <Text>Days: {userData.week_day}</Text>
            <Text>Hours: {userData.hour}</Text>

            {/*link to maps */}
            <Text>Address: {userData.address}</Text>

            {/*link to phone dial*/}
            <Text>Phone: {userData.phone}</Text>

            {/* TODO: link to default email*/}
            <Text>Email: {userData.email}</Text>

            {/* TODO: MAKE userData.website A CLICKABLE URL LINK*/}
            <Text>Website: {userData.website}</Text>
          </View>
        </View>
        <Text
          style={{
            fontSize: 18,
            textAlign: 'center',
            color: 'grey'
          }}>
          Hand_Up database
        </Text>
        <Text
          style={{
            fontSize: 16,
            textAlign: 'center',
            color: 'grey'
          }}>
          app still being developed
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default ViewResource;