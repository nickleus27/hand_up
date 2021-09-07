# hand_up

#will need to have react-native set up on computer see: https://reactnative.dev/docs/

0. After cloning repository: in your terminal navigate into hand_up file directory and follow these steps.

1. run command, npm i, in terminal in project directory after downloading repository. This will install node_modules into project directory. After this you can run project.
2. run commands:
3. npm install @react-navigation/native --save
4. npm install @react-navigation/stack --save
5. npm install react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-community/masked-view --save
6. npm install --save react-native-push-notification
7. npm install --save @react-native-community/push-notification-ios
9. cd ios && pod install && cd ..
10. To run while in directory use command:
11.  npx react-native run-ios (for ios)
12.  npx react-native run-android (for android)

Purpose: an app to help people find resources in a situation of being without job or house: examples: soup kitchens, shelters, work agencies, government resources, etc.

Current State of App: App will give notifications and directions of upcoming requested resource events.

Goals and Knowledge learned: 
1.  Create layout: scrollview, navigation to multiple screens, text entry, and buttons.
2.  Create a database: Preloaded sql database.
3.  Create local push notifications: ios and android.

Related Projecsts:
1.  Web Crawler in python to scrape information for SQL database from the internet
