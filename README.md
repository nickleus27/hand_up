# hand_up: an app to provide local resources and notifications

Purpose: An app to help people find resources in a situation of being without job or house. Example resources: soup kitchens, shelters, work agencies, government resources, etc.  Will try to make this app work with as little internet required as possible since people who need this app may have limited internet / data access.  The goal will be to put resources into SQLite database so all the person will need is a smart phone and one time internet access to download app.

Current State of App: App will give notifications and directions of upcoming requested resource events.

Goals and Knowledge learned: 
1.  Create layout: scrollview, navigation to multiple screens, text entry, and buttons.
2.  Create a database: Preloaded sql database.
3.  Create local push notifications: ios and android.

Related Projects:
1.  Web Crawler in python to scrape information for SQL database from the internet

#will need to have react-native set up on computer see: https://reactnative.dev/docs/

0. After cloning repository: in your terminal navigate into hand_up file directory and follow these steps.

1. run command, npm i, in terminal in project directory after downloading repository. This will install node_modules into project directory. After this you can run project.
A.  may need to use command if error: npm install --save --legacy-peer-deps

2. cd ios && pod install && cd ..

To run while in directory use command:
3.  npx react-native run-ios (for ios)
4.  npx react-native run-android (for android)
