// Pre-Populated SQLite Database in React Native
// https://aboutreact.com/example-of-pre-populated-sqlite-database-in-react-native

import React, {useEffect} from 'react';
import {View, Text, SafeAreaView, Button} from 'react-native';
import Mybutton from './components/Mybutton';
import Mytext from './components/Mytext';
import {openDatabase} from 'react-native-sqlite-storage';

//import PushNotification from 'react-native-push-notification';
import PushNotification, {Importance} from 'react-native-push-notification';

// Connction to access the pre-populated user_db.db
const db = openDatabase({name: 'soup_kitchen_sc.db', createFromLocation: 1});

const HomeScreen = ({navigation}) => {
  useEffect(() => {
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='soup_kitchen_table'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS soup_kitchen_table', []);
            txn.executeSql(
                //TODO: LEFT OFF RIGHT HERE
              'CREATE TABLE IF NOT EXISTS soup_kitchen_table(row_id INTEGER PRIMARY KEY AUTOINCREMENT, org_name VARCHAR(20), week_day VARCHAR(10), HOUR VARCHAR(10), address VARCHAR(255), phone VARCHAR(12), email VARCHAR(255))',
              [],
            );
          }
        },
      );
    });
  }, []);


  const time = () =>{
    let time = new Date();
    let hours = time.getHours();
    let minutes = time.getMinutes();
    return (hours + ":" +minutes);
  };
  const messageString = () =>{
    return ("The time right now is " + time());
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


  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <View style={{flex: 1}}>
          <Mytext
            text="Local Resources To Help"
          />

          <Button
            title="trigger notification"
            onPress={triggerNotificationHandler}
          />

          <Mybutton
            title="View All"
            customClick={() => navigation.navigate('ViewAll')}
          />
        </View>
        <Text
          style={{
            fontSize: 18,
            textAlign: 'center',
            color: 'grey'
          }}>
          An App that provides your local resources
        </Text>
        <Text
          style={{
            fontSize: 16,
            textAlign: 'center',
            color: 'grey'
          }}>
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;