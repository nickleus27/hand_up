/* need to move notifications to view all page eventually and use check boxes*/

import React, {useState} from 'react';
import {Text, View, SafeAreaView} from 'react-native';
import Mytextinput from './components/Mytextinput';
import Mybutton from './components/Mybutton';
import {openDatabase} from 'react-native-sqlite-storage';
import FireTime from './library/FireTime';
//import PushNotification from 'react-native-push-notification';
import PushNotification from 'react-native-push-notification';
//import checkboxes for notification selection
//import CheckBox from '@react-native-community/checkbox';


// Connction to access the pre-populated user_db.db
const db = openDatabase({name: 'soup_kitchen_sc.db', createFromLocation: 1});

const ViewResource = () => {

  const [toggleCheckBox, setToggleCheckBox] = useState(false);

  /*
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
        startHour = startHour-nowHour;
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
    const length = string.length;
    if (string[length-2] === 'p' || string[length-2] === 'P'){
        afternoon = true;
    }
    return afternoon;
};
*/

  let messageString = (resource) =>{
    return (resource.org_name + ' is open '+resource.week_day + ' from ' + resource.hour);
  };


  const triggerNotificationHandler = (resource) => {
//ADD PARAMETER FOR OPTION OF CHOOSING START TIME
//this is a time in miliseconds that notification should start prior to date
const timeAhead = 3600000;//1 hour ahead start time


    PushNotification.localNotificationSchedule({
      
      //... You can use all the options from localNotifications
      //need to assing notification id, see comment above triggerActivNotif()
      channelId: "soup_kitchen_resources",

      //NEED NOTIFID <--------***

      message: messageString(resource), // (required)


      //Still cant get FireTime class to work.  want to seperate this functions to just FireTime class so they dont need to be here
      date: new Date(Date.now() + FireTime.timeFire(resource.hour)-timeAhead), // sets to fire on time of event <------need to set an hour in advance-----###
      allowWhileIdle: true, // (optional) set notification to work while on doze, default: false
    
      /* Android Only Properties */
      repeatType: "day", // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
    });
   };

   /* use a counter variable to increment and parse to string for notif id.
   use notif id for deleting individual notifs.  keep track of id's by keeping variable
   in list associated with each check box in viewall page.
   *///SHOULD I NAME THIS CANCEL ALL NOTIFICATIONS?
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

          {/* NEED TO COLORIZE CHECK BOX AND CENTER */}
          {/*}
          <CheckBox
          title = 'test check box'
          disabled={false}
          value={toggleCheckBox}
          onValueChange={(newValue) => setToggleCheckBox(newValue)}
        />
  */}
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