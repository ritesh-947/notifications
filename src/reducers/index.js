// auth2/authpage/src/reducers/index.js

import { combineReducers } from 'redux';
import authReducer from './authReducer';
import alertReducer from './alertReducer'; // Import the alert reducer

const rootReducer = combineReducers({
    auth: authReducer,
    alert: alertReducer, // Add alert reducer to the root reducer
});

export default rootReducer;