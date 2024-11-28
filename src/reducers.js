import { combineReducers } from 'redux';

// Example reducer for user authentication
const authReducer = (state = { isAuthenticated: false, user: null }, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return { ...state, isAuthenticated: true, user: action.payload };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false, user: null };
    default:
      return state;
  }
};

// Example reducer for app data
const dataReducer = (state = { items: [] }, action) => {
  switch (action.type) {
    case 'SET_ITEMS':
      return { ...state, items: action.payload };
    default:
      return state;
  }
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  data: dataReducer,
});

export default rootReducer;