# hand_up

#will need to have react-native set up on computer see: https://reactnative.dev/docs/

0. After cloning repository: in your terminal navigate into hand_up file directory and follow these steps.

1. run command, npm i, in terminal in project directory after downloading repository. This will install node_modules into project directory. After this you can run project.
2. run commands:
3. npm install react-native-sqlite-storage --save
4. npm install @react-navigation/native --save
5. npm install @react-navigation/stack --save
6. npm install react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-community/masked-view --save
7. cd ios && pod install && cd ..
8. now you can run app in ios or android...npx react-native run-ios, or npx react-native run-android

purpose: an app to help people find resources in a situation of being without job or house: examples: soup kitchens, shelters, work agencies, government resources, aa and na meetings

for starter: app will give notifications and directions of upcoming requested resource events

goals: 1.create layout: scrollview, navigation to multiple screens, text entry, and buttons 2.create a database: locally or on server? Possible sql database on phone 3.create web scraper: find a way to scrape information we need for resource database
