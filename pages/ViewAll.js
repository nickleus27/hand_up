// Pre-Populated SQLite Database in React Native
// https://aboutreact.com/example-of-pre-populated-sqlite-database-in-react-native
// Screen to view all the user*/

import React, {useState, useEffect} from 'react';
import {FlatList, Text, View, SafeAreaView} from 'react-native';
import {openDatabase} from 'react-native-sqlite-storage';

// Connction to access the pre-populated user_db.db
const db = openDatabase({name: 'soup_kitchen_sc.db', createFromLocation: 1});

const ViewAll = () => {
  let [flatListItems, setFlatListItems] = useState([]);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM soup_kitchen_table',
      [],
      (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i)
          temp.push(results.rows.item(i));
        setFlatListItems(temp);
      });
    });
  }, []);

  let listViewItemSeparator = () => {
    return (
      <View style={{height: 0.2, width: '100%', backgroundColor: '#808080'}} />
    );
  };

  let listItemView = (item) => {
    return (
      <View 
        key={item.row_id}
        style={{backgroundColor: 'white', padding: 20}}>
        <Text>Id: {item.row_id}</Text>
        <Text>Organization: {item.org_name}</Text>
        <Text>Days: {item.week_day}</Text>
        <Text>Hours: {item.hour}</Text>
        <Text>Address: {item.address}</Text>
        <Text>Phone: {item.phone}</Text>
        <Text>Email: {item.email}</Text>
        <Text>Website: {item.website}</Text>
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

export default ViewAll;