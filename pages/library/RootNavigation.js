// RootNavigation.js

//import { createNavigationContainerRef } from '@react-navigation/native';
import * as React from 'react';

export const navigationRef = React.createRef();

export function navigate(name, params) {
    /*
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }else{
    navigationRef.current.getRootState();
  }
  */
  navigationRef.current?.navigate(name, params);

}