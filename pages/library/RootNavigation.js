// RootNavigation.js

import { createNavigationContainerRef } from '@react-navigation/native';
import { StackActions } from '@react-navigation/native'

export const navigationRef = createNavigationContainerRef();

export function navigate(name, params) {

  //this is my first attempt to use async functions
  //testing to see if this will work...

  //need to add error catching...?catch block? reject block...???
  async function navIsReady(){
    while(!navigationRef.isReady){
      //do nothing
    }
    return navigationRef.isReady();
  }
  navIsReady().then(navigationRef.dispatch(StackActions.push(name, params)));

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