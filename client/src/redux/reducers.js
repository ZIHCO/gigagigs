import { combineReducers } from 'redux';
import { LOGIN, LOGOUT, UPDATEPROFILE, CLOSEUPDATEPROFILE, } from './actions.js';

const authDefaultState = {authenticated: false};

export const authReducer = (state=authDefaultState, action) => {
  switch (action.type) {
  case LOGIN:
    return {authenticated: true};
  case LOGOUT:
    return {authenticated: false};
  default:
    return state;
  }
};

export const editProfileReducer = (state=false, action) => {
  switch (action.type) {
  case UPDATEPROFILE:
    return true;
  case CLOSEUPDATEPROFILE:
    return false;
  default:
    return state;
  }
};

export const rootReducer = combineReducers({
  auth: authReducer,
  editProfile: editProfileReducer,
});