// redux/slices/transcriptSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  content: '',
};

const transcriptSlice = createSlice({
  name: 'transcript',
  initialState,
  reducers: {
    setTranscript: (state, action) => {
      state.content = action.payload;
    },
    appendTranscript: (state, action) => {
      state.content += (state.content ? ' ' : '') + action.payload;
    },
    clearTranscript: (state) => {
      state.content = '';
    },
  },
});

export const { setTranscript, appendTranscript, clearTranscript } = transcriptSlice.actions;

export default transcriptSlice.reducer;
