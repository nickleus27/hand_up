// Pre-Populated SQLite Database in React Native
// https://aboutreact.com/example-of-pre-populated-sqlite-database-in-react-native

import React, {useEffect} from 'react';
import {View, Text, SafeAreaView} from 'react-native';
import Mybutton from './components/Mybutton';
import Mytext from './components/Mytext';
import {openDatabase} from 'react-native-sqlite-storage';


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
              'CREATE TABLE IF NOT EXISTS soup_kitchen_table(row_id INTEGER PRIMARY KEY AUTOINCREMENT, org_name VARCHAR(20), week_day VARCHAR(10), hour VARCHAR(10), address VARCHAR(255), phone VARCHAR(12), email VARCHAR(255), website VARCHAR(255), isSelect VARCHAR(5), notif VARCHAR(12))',
              [],
            );
          }
        },
      );
    });
  }, []);
  
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <View style={{flex: 1}}>
          <Mytext
            text="Local Resources To Help"
          />

          <Mybutton
            title="View Resource"
            customClick={()=> navigation.navigate('ViewResource')}
          />

          <Mybutton
            title="Resources"
            customClick={() => navigation.navigate('ViewAll')}
          />

          <Mybutton
            title="Notification Settings"
            customClick={() => navigation.navigate('NotifSetting')}
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