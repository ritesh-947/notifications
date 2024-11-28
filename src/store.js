import { configureStore } from '@reduxjs/toolkit';
import { composeWithDevTools } from '@redux-devtools/extension';
import rootReducer from './reducers';

const store = configureStore({
  reducer: rootReducer,
  enhancers: [composeWithDevTools()],
});

export default store;