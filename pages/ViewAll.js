/*  Nicholas Anderson
**  July 2021
**  this page is to view a list of local resources
**  and to link resource phone number to phone, web url to web browser, and address to maps
*/

"use strict";

import React, {useState, useEffect} from 'react';
import {FlatList, Text, View, SafeAreaView, Linking, Platform, StyleSheet} from 'react-native';
import {openDatabase} from 'react-native-sqlite-storage';

// Connction to access the pre-populated soup_kitchen_sc.db
const db = openDatabase({name: 'soup_kitchen_sc.db', createFromLocation: 1});

const ViewAll = () => {

  let [flatListItems, setFlatListItems] = useState([]);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM soup_kitchen_table',
      [],
      (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i){
          temp.push(results.rows.item(i));
          //console.log(results.rows.item(i));
        }
        setFlatListItems(temp);
        //console.log(temp);
      });
    });
  }, []);

//function to open address in maps
    const openMap = async (address) => {
    const destination = encodeURIComponent(`${address}`);  
    const provider = Platform.OS === 'ios' ? 'apple' : 'google'
    const link = `http://maps.${provider}.com/?daddr=${destination}`;

    try {
        const supported = await Linking.canOpenURL(link);

        if (supported) Linking.openURL(link);
    } catch (error) {
        console.log(error);
    }
}


  let listViewItemSeparator = () => {
    return (
      <View style={{height: 0.2, width: '100%', backgroundColor: '#808080'}} />
    );
  };


  let listItemView = (item) => {
    return (
        <View>
        <Text>Id: {item.row_id}</Text>
        <Text>Organization: {item.org_name}</Text>
        <Text>Days: {item.week_day}</Text>
        <Text>Hours: {item.hour}</Text>
        <Text
            style={styles.maplinkStyle}
            onPress={()=>{openMap(item.address);
                  }}>
            Address: {item.address}</Text>
        <Text
            style={styles.phonelinkStyle}
            onPress={() => {
              Linking.openURL(`tel:${item.phone}`);
            }}>
            Phone: {item.phone}</Text>
        <Text
            style={styles.hyperlinkStyle}
            onPress={()=> {
              Linking.openURL(`mailto:${item.email}`);}}>
          Email: {item.email}</Text>
        <Text
            style={styles.hyperlinkStyle}
            onPress={() => {
              Linking.openURL(item.website);
            }}>
            Website: {item.website}</Text>
      </View>
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
  hyperlinkStyle: {
    color: 'blue',
  },
  phonelinkStyle: {
    color: 'green',
  },
  maplinkStyle: {
    color: 'orange',
  },
});

export default ViewAll;