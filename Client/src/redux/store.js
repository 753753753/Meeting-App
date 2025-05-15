// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import transcriptReducer from './slices/transcriptSlice';

export const store = configureStore({
  reducer: {
    transcript: transcriptReducer,
    // other reducers...
  },
  devTools: {
    trace: true,
    traceLimit: 1000,
    maxAge: 100,
    features: {
      pause: true,
      export: true,
      import: 'custom',
      jump: true,
      skip: true,
      reorder: true,
      dispatch: true,
      test: true,
    },
    maxSize: 1024 * 1024, // Increase state size limit to 1MB
  },
});
