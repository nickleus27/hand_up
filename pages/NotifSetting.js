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
import NotifService from './library/NotifService';
//import CheckBox from '@react-native-community/checkbox';


// Connction to access the pre-populated soup_kitchen_sc.db
const db = openDatabase({name: 'soup_kitchen_sc.db', createFromLocation: 1});
let notif = new NotifService();
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

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM soup_kitchen_table',
      [],
      (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i){
          temp.push(results.rows.item(i));
        }
        temp.map((item)=>{
          item.isSelect = (item.isSelect === 'true');
          return item;
        });
        setFlatListItems(temp);
      });
    });
    alert('When setting a notification it will set for an hour ahead of time. If setting resource that is opening in the next hour, the notification will set for the next day open. To reactivate notification for resources that do not open everyday, you will have to open the notifciation when you receive it. If you did not open notification you will have to turn notification off and back on in settings to reactivate it.');
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

  let selectItem = (item) => {

    item.isSelect = !item.isSelect;
    /*
    counter = counter+1;//use counter for notif_id
    console.log('this is counter ' + counter);
    saveData;//saves counter to persistant data
    */
    if(item.isSelect){
      //item.notif = counter.toString();
      notif.triggerNotificationHandler(item);
      updateSelect(item);
    }else{
      notif.triggerCancelNotifHandler(item.row_id.toString());
      updateSelect(item);

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