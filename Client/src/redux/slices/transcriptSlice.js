// redux/slices/transcriptSlice.js
import { createSlice } from '@reduxjs/toolkit';

const transcriptSlice = createSlice({
  name: 'transcript',
  initialState: '',
  reducers: {
    setTranscript: (state, action) => action.payload,
    appendTranscript: (state, action) => (state ? state + ' ' + action.payload : action.payload),
    clearTranscript: () => '',
  },
});

export const { setTranscript, appendTranscript, clearTranscript } = transcriptSlice.actions;

export default transcriptSlice.reducer;
