// Pre-Populated SQLite Database in React Native
// https://aboutreact.com/example-of-pre-populated-sqlite-database-in-react-native
// Screen to view single user

import React, {useState} from 'react';
import {Text, View, SafeAreaView} from 'react-native';
import Mytextinput from './components/Mytextinput';
import Mybutton from './components/Mybutton';
import {openDatabase} from 'react-native-sqlite-storage';

//import PushNotification from 'react-native-push-notification';
import PushNotification, {Importance} from 'react-native-push-notification';

// Connction to access the pre-populated user_db.db
const db = openDatabase({name: 'soup_kitchen_sc.db', createFromLocation: 1});

const ViewResource = () => {

  let messageString = () =>{
    return (userData.org_name + ' is open '+userData.week_day + ' from ' + userData.hour);
  };
  const triggerNotificationHandler = () => {
    PushNotification.createChannel(
      {
        channelId: "soup_kitchen_resources", // (required)
        channelName: "Soup Kitchen Resources", // (required)
        channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
        playSound: false, // (optional) default: true
        soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
      },
      (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
    PushNotification.localNotificationSchedule({
      //... You can use all the options from localNotifications
      channelId: "soup_kitchen_resources",
      message: messageString(), // (required)
      date: new Date(Date.now() + 1 * 1000), // in 1 secs
      allowWhileIdle: true, // (optional) set notification to work while on doze, default: false
    
      /* Android Only Properties */
      repeatType: "day", // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
    });
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
            setUserData(results.rows.item(0));

            //THIS TRIGGERS NOTIFICATION HERE
           // triggerNotificationHandler();
          } else {
            alert('No resource found');
          }
        },
      );
    });
  };


{/* figure out how to triggerNotificationHandler funtion to be called after userData is set from searchUser funtion with the new data.
at the moment the notification fires with the data from previous state change*/}
  let triggerActions = () =>{
    searchUser();
    triggerNotificationHandler();
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <View style={{flex: 1}}>
          <Mytextinput
            placeholder="Enter resource Id"
            onChangeText={(inputUserId) => setInputUserId(inputUserId)}
            style={{padding: 10}}
          />
          <Mybutton title="Search resource" customClick={triggerActions} />
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
            <Text>Address: {userData.address}</Text>
            <Text>Phone: {userData.phone}</Text>
            <Text>Email: {userData.email}</Text>
          </View>
        </View>
        <Text
          style={{
            fontSize: 18,
            textAlign: 'center',
            color: 'grey'
          }}>
          Pre-Populated SQLite Database in React Native
        </Text>
        <Text
          style={{
            fontSize: 16,
            textAlign: 'center',
            color: 'grey'
          }}>
          www.aboutreact.com
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default ViewResource;