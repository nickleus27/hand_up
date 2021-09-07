// RootNavigation.js

import { createNavigationContainerRef } from '@react-navigation/native';
import { StackActions } from '@react-navigation/native'

export const navigationRef = createNavigationContainerRef();

export function navigate(name, params) {

  //this is my first attempt to use async functions
  //testing to see if this will work...

  //I DO NOT BELIEVE THIS IS WORKING THE WAY I THINK IT IS....
  /*
  async function navIsReady(){
    while(!navigationRef.isReady && !navigationRef.isFocused){
      //do nothing
      console.log("waiting for screen render");
    }
    return navigationRef.isReady();
  }
    navIsReady().then(navigationRef.dispatch(StackActions.push(name, params)));

  */
 /*
  async function waitForNav() {
    let myPromise = new Promise(function(myResolve, myReject) {
      setTimeout(function() { myResolve( navigationRef.dispatch(StackActions.push(name, params))
        ); }, 3000);
    });
    const executeNav = await myPromise;
    executeNav;
  }
  waitForNav();
  */
  
//This doesnt navigate to page upon opening notification everytime???
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.push(name, params))
    }else{
    //what to do if navigation is NOT ready...
    navigationRef.current.getRootState();
  }
  

}