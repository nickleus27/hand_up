// Pre-Populated SQLite Database in React Native
// https://aboutreact.com/example-of-pre-populated-sqlite-database-in-react-native
// Screen to view single user

import React, {useState} from 'react';
import {Text, View, SafeAreaView} from 'react-native';
import Mytextinput from './components/Mytextinput';
import Mybutton from './components/Mybutton';
import {openDatabase} from 'react-native-sqlite-storage';
//import FireTime from './bus_log/FireTime';
//import PushNotification from 'react-native-push-notification';
import PushNotification, {Importance} from 'react-native-push-notification';


// Connction to access the pre-populated user_db.db
const db = openDatabase({name: 'soup_kitchen_sc.db', createFromLocation: 1});

const ViewResource = () => {

  const timeFire = (string) =>{
    let afternoon = false;
    afternoon = isAfternoon(string);
    let startHour = hourStringToInt(string)[0];
    let startMins = hourStringToInt(string)[1];
    let fireDate = new Date();

    //add days num of days...need to acount for if passed day of week already
    //if()
    const nowday = fireDate.getDay();
    //add hours...check if in afternoon...
    const nowHour = fireDate.getHours();
   
    if(afternoon){
        if(startHour<12){
            startHour += 12;//convert to 'military' time
        }
    }
 
    if(startHour-nowHour<0){//if negative number the hour has already passed
        startHour = 24+(startHour-nowHour);
    }else{
        startHour = startHour-nowHour
    }
 
    //add minutes
    const nowMinutes = fireDate.getMinutes();

    startMins = startMins - nowMinutes;
    
    if(startHour === 0 && startMins<0){//if notif triggered a few minutes after start time
        startHour = 24;
    }
    
    //fireDate.setHours(fireDate.getHours() +startHour);
    //fireDate.setMinutes(fireDate.getMinutes() + startMins);
    console.log(startHour);
    console.log(startMins);
    return((startHour*3600000)+(startMins*60000));//how many milliseconds until fire date

//https://stackoverflow.com/questions/3572561/set-date-10-days-in-the-future-and-format-to-dd-mm-yyyy-e-g-21-08-2010
//convert days, hours, minutes....to seconds? or milliseconds?
//new Date(Date.now() + 1000 /*sec*/ * 60 /*min*/ * 60 /*hour*/ * 24 /*day*/ * 10)

};


const hourStringToInt = (string) =>{
    //TODO: still need to check bounds and corner cases
    let tempHour = '';
    let tempMin = ''
    let isHour = true;
    let index = 0;
    let timearr = [];
    while(index < string.length){
        if(string[index] >= '0' && string[index] <= '9' && isHour){
            tempHour += string[index];
        }else if(string[index] === ':' && isHour){
            isHour = false;
        }else if(string[index] >= '0' && string[index] <= '9' && !isHour){
            tempMin += string[index];
        }else{
            if(tempMin === ''){
                timearr.push(parseInt(tempHour, 10));
                timearr.push(0);
                return timearr;
            }else{
                timearr.push(parseInt(tempHour, 10));
                timearr.push(parseInt(tempMin, 10));
                return timearr;
            }
        }
        index++;
    }
    return parseInt(tempHour, 10);
};

//TODO: NEED TO FIX FOR SCENARIO WHERE 10AM-2PM OR NO AFTERNOON PM INDICATOR
const isAfternoon = (string) =>{
    //TODO: still need to check for bounds and corner cases....example null?...no am or pm???
    let afternoon = false;
    const length = string.length
    if (string[length-2] === 'p' || string[length-2] === 'P'){
        afternoon = true;
    }
    return afternoon;
};

  let messageString = (resource) =>{
    return (resource.org_name + ' is open '+resource.week_day + ' from ' + resource.hour);
  };
  const triggerNotificationHandler = (resource) => {
    PushNotification.createChannel(
      {
        channelId: "soup_kitchen_resources", // (required)
        channelName: "Soup Kitchen Resources", // (required)
        channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
        playSound: true, // (optional) default: true
        soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
      },
      (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
    PushNotification.localNotificationSchedule({
      //... You can use all the options from localNotifications
      channelId: "soup_kitchen_resources",
      message: messageString(resource), // (required)
      date: new Date(Date.now()+timeFire(resource.hour)),//new Date(Date.now() + FireTime.timeFire('6:19pm')),//new Date(Date.now() + 1 * 1000), // in 1 secs
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