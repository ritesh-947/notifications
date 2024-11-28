import { configureStore } from '@reduxjs/toolkit';
import { composeWithDevTools } from '@redux-devtools/extension';
import rootReducer from './reducers'; // Combine your reducers here

const store = configureStore({
    reducer: rootReducer, // Your root reducer
    devTools: composeWithDevTools({
        trace: true, // Enable tracing for better debugging
        traceLimit: 25,
    }),
});

export default store;