/*  Nicholas Anderson
**  July 2021
**  this page is to select notification settings for sc resource database for people experiencing houselessness
*/


/**
 * should uninstall unused packages, AsyncStorage and CheckBox
 */
"use strict";

import React, {useState, useEffect} from 'react';
import {FlatList, Text, View, SafeAreaView, TouchableOpacity, StyleSheet} from 'react-native';
import {openDatabase} from 'react-native-sqlite-storage';
//import AsyncStorage from '@react-native-async-storage/async-storage';
//import FireTime from './library/FireTime';
import PushNotification from 'react-native-push-notification';
//import PushNotificationIOS from '@react-native-community/push-notification-ios';
import NotifService from './library/NotifService';
//import checkboxes for notification selection
//import CheckBox from '@react-native-community/checkbox';


// Connction to access the pre-populated soup_kitchen_sc.db
const db = openDatabase({name: 'soup_kitchen_sc.db', createFromLocation: 1});
/*
const STORAGE_KEY = '@save_counter';//for persistent upkeep of count:  @react-native-async-storage/async-storage
let counter = 0;
*/
const NotifSetting = () => {
  //const [toggleCheckBox, setToggleCheckBox] = useState(false);
/*
readData;//sets counter = to persistent data
console.log(counter);
*/

  let [flatListItems, setFlatListItems] = useState([]);
  let [refresh, setrefresh] = useState(false);
  let [notif, setnotif] = useState([]);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM soup_kitchen_table',
      [],
      (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i){
          temp.push(results.rows.item(i));
          console.log(results.rows.item(i));
        }
        temp.map((item)=>{
          item.isSelect = (item.isSelect === 'true');
          return item;
        });
        setFlatListItems(temp);
        console.log(flatListItems);
      });
    });
  }, []);

  //<------------###3
  useEffect(() => {
    setnotif(new NotifService());
  }, []);


  let listViewItemSeparator = () => {
    return (
      <View style={{height: 0.2, width: '100%', backgroundColor: '#808080'}} />
    );
  };

  /*
  const saveData = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, counter.toString())
      console.log('Data successfully saved')
    } catch (e) {
      console.log('Failed to save the data to the storage')
    }
  }

  const readData = async () => {
    try {
      const tempCount = await AsyncStorage.getItem(STORAGE_KEY)
  
      if (tempCount !== null) {
        counter = parseInt(tempCount);
      }else{
        counter = 0;
      }
    } catch (e) {
      console.log('Failed to fetch the data from storage')
    }
  }
  */

  /*
  _handleNotificationOpen = () =>{
    const {navigate} = this.props.navigation;
    navigate('ViewAll');
  }
  */

  //NEED TO CALL NOTIFICATION HANDLER HERE <-----##
  let selectItem = (item) => {

    item.isSelect = !item.isSelect;
    /*
    counter = counter+1;//use counter for notif_id
    console.log('this is counter ' + counter);
    saveData;//saves counter to persistant data
    */
    if(item.isSelect){
      //item.notif = counter.toString();
      notif.triggerNotificationHandler(item);//, counter.toString());
      updateSelect(item);//item.isSelect, counter.toString(), item.row_id);//updates database to store notification settings
      PushNotification.getScheduledLocalNotifications((notifs)=>{
        console.log(notifs);
       });
    }else{
      console.log('i am here ! <----------------')
      notif.triggerCancelNotifHandler(item.row_id.toString());//this wont work on ios as is
      updateSelect(item);//item.isSelect, '', item.row_id);//updates database to store notification settings

    }

    const index = item.row_id -1;
    flatListItems[index] = item;
    setFlatListItems(flatListItems);

    refresh = !refresh;
    setrefresh(refresh);//refreshes render
  };


  let updateSelect = (resource) => {//itemSelect, itemNotifID, rowID) => {
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE soup_kitchen_table set isSelect=? where row_id=?',  //, notif=? where row_id=?',
        [resource.isSelect.toString(), resource.row_id.toString()],//itemNotifID, rowID],
        (tx, results) => {
          console.log('Results' + results);
          if (results.rowsAffected > 0) {
            console.log(
              'Success',
              'User updated successfully',
              {cancelable: false},
            );
          } else console.log('Update Failed');
        },
      );
    });
  };


/* 2 <-----###
  let messageString = (resource) =>{
    return (resource.org_name + ' is open '+resource.week_day + ' from ' + resource.hour);
  };
*/

  /*  #----> 1 <----#
  const triggerNotificationHandler = (resource)=>{ //, notifID) => {
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
      message: messageString(resource), // (required)
      date: new Date(Date.now() + FireTime.timeFire(resource.hour, resource.week_day)-timeAhead), //timeFire returns milliseconds until date, and timeAhead is milliseconds prior to date
      allowWhileIdle: true, // (optional) set notification to work while on doze, default: false
    
      / Android Only Properties
      repeatType: (FireTime.isEveryday(resource.week_day)) ? "day" : "", // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
    });
  }
};

//trigers cancelation of notification with id
   const triggerCancelNotifHandler = (notifID) =>{


    //ADD IOS VERSION HERE <--------------##### THESE METHODS WONT WORK ON IOS...PUSHNOTIFICAITIONIOS

    
    //PushNotification.getScheduledLocalNotifications((notifs)=>{
    //  console.log(notifs);
    // })
     
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
###-------END OF COMMENT #1------->*/

  let listItemView = (item) => {
    return (
      <TouchableOpacity 
      style={item.isSelect ? styles.selected : styles.list}      
      onPress={() => 
        selectItem(item)}

        //start switching notification calls to hear.  need a counter variable to keep track of notication_id...could keep a corresponding array for this too?
        //or a map for this...probably a map <----##
      
       >
        <Text>Id: {item.row_id}</Text>
        <Text>Organization: {item.org_name}</Text>
        <Text>Days: {item.week_day}</Text>
        <Text>Hours: {item.hour}</Text>
        <Text>Address: {item.address}</Text>
        <Text>Phone: {item.phone}</Text>
        <Text>Email: {item.email}</Text>
        <Text>Website: {item.website}</Text>
        <Text
          style = {{textAlign : 'center',
                    fontSize : 18,
                    color : '#48d1cc'}}> Notifications: {item.isSelect ? 'ON' : 'OFF'}</Text>

        {/*NEED TO FIND HOW TO HAVE EACH INDIVIDUAL BOX CHECK SEPERATELY AND NOT ALL SIMULTANEOUSLY
        MAYBE BECAUSE OF THE USE STATE TOGGLE AT TOP OF PAGE??  ALSO NEED TO BE ABLE TO CALL FUNCTION 
        ACCORDING TO TURE OR FALSE STATE.  US ONPRESS ATTRICBUTE.  ALSO NEED TO KEEP TRACK OF NOTIFICATION
        ID WHEN SCHEDLOCALNOTIF GETS CALLED SO IT CAN BE DELETED WHEN UNCHECK */}
        {/*
        <CheckBox
          disabled={false}
          value={toggleCheckBox}
          onValueChange={(newValue) => setToggleCheckBox(newValue)}
        />
        */}

      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <View style={{flex: 1}}>
          <FlatList
            data={flatListItems}
            ItemSeparatorComponent={listViewItemSeparator}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => listItemView(item)}
            extraData = {refresh}
          />
        </View>
        <Text
          style={{
            fontSize: 18,
            textAlign: 'center',
            color: 'grey'
          }}>
          Local Resource Database in React Native
        </Text>
        <Text
          style={{
            fontSize: 16,
            textAlign: 'center',
            color: 'grey'
          }}>
          (website name...)
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  list :{
    backgroundColor: "#e0ffff",
  },
  selected: {backgroundColor: "#ba55d3"},
});

export default NotifSetting;