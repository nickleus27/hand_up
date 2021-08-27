// RootNavigation.js

import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigate(name, params) {

  //this is my first attempt to use async functions
  //testing to see if this will work...
  console.log('before async function called')
  async function navIsReady(){
    index = 0;
    while(!navigationRef.isReady){
      console.log("this is in while loop in async function", index);
      index += 1;
    }
    console.log(navigationRef.isReady());
    return navigationRef.isReady();
  }
  navIsReady().then(navigationRef.navigate(name, params));
  console.log("this is after async function");
  /*
//HOW TO ASYNCHRONOUSLY AWAIT FOR isReady to be true??
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }else{
    //what to do if navigation is NOT ready...
    navigationRef.current.getRootState();
  }
  */

}