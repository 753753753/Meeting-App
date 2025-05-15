// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import transcriptReducer from './slices/transcriptSlice';
// import other reducers...

export const store = configureStore({
  reducer: {
    transcript: transcriptReducer,
    // other reducers...
  },
});
