/**
 * Nick Anderson
 * Augest 19, 2021
 * This page shows individual resource from onNotification click
 * This page doesn't load consistently onNotification click
 */
 "use strict";

import React, {useState, useEffect} from 'react';
import {Text, View, SafeAreaView, Linking, StyleSheet, Platform} from 'react-native';
import {openDatabase} from 'react-native-sqlite-storage';

const db = openDatabase({name: 'soup_kitchen_sc.db', createFromLocation: 1});


const SingleResourceView = ({route, navigation}) => {

    let {id,} =route.params;
    id = parseInt(JSON.parse(id), 10);
    let [resourceData, setResourceData] = useState({});
    
    useEffect(()=>{

        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM soup_kitchen_table where row_id = ?',
                [id],
                (tx, results) => {
                        var len = results.rows.length;
                        console.log('len', len);
                    if (len > 0) {
                        setResourceData(results.rows.item(0));
                    } else {
                        alert('No resource found');
                    }
                },
            );
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
    

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <View style={{flex: 1}}>

          <View
            style={{
              marginLeft: 35,
              marginRight: 35, 
              marginTop: 10
            }}>
            <Text>Id: {resourceData.row_id}</Text>
            <Text>Organization: {resourceData.org_name}</Text>
            <Text>Days: {resourceData.week_day}</Text>
            <Text>Hours: {resourceData.hour}</Text>

            {/*link to maps */}
            <Text
                style={styles.maplinkStyle}
                onPress={()=>{
                    openMap(resourceData.address);}}>
                Address: {resourceData.address}</Text>

            {/*link to phone dial*/}
            <Text
                style={styles.phonelinkStyle}
                onPress={() => {
                    Linking.openURL(`tel:${resourceData.phone}`);}}>
                Phone: {resourceData.phone}</Text>

            {/* TODO: link to default email*/}
            <Text
                style={styles.hyperlinkStyle}
                onPress={()=> {
                    Linking.openURL(`mailto:${resourceData.email}`);}}>
                    Email: {resourceData.email}</Text>

            {/* TODO: MAKE userData.website A CLICKABLE URL LINK*/}
            <Text
                style={styles.hyperlinkStyle}
                onPress={() => {
                Linking.openURL(resourceData.website);}}>
                Website: {resourceData.website}</Text>
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

export default SingleResourceView;