import { configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk'; // Named import
import { composeWithDevTools } from '@redux-devtools/extension'; // Correct import

import rootReducer from './reducers'; // Ensure you have your root reducer

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk), // Use a callback to add middleware
  
  devTools: process.env.NODE_ENV !== 'production', // Enable devTools only in development
});

export default store;