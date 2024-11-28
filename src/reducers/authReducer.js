// auth2/authpage/src/reducers/authReducers.js

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null,
    error: null,
  };
  
  export default function authReducer(state = initialState, action) {
    switch (action.type) {
      case 'REGISTER_SUCCESS':
      case 'LOGIN_SUCCESS':
        localStorage.setItem('token', action.payload);
        return {
          ...state,
          token: action.payload,
          isAuthenticated: true,
          loading: false,
          error: null,
        };
      case 'REGISTER_FAIL':
      case 'LOGIN_FAIL':
        localStorage.removeItem('token');
        return {
          ...state,
          token: null,
          isAuthenticated: false,
          loading: false,
          error: action.payload,
        };
      default:
        return state;
    }
  }