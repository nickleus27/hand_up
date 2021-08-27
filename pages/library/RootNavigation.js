// RootNavigation.js

import * as NavRef from '@react-navigation/native';

export const navigationRef = NavRef.createNavigationContainerRef();

export function navigate(name, params) {
    
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }else{
    navigationRef.current.getRootState();
  }

}