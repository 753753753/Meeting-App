// SpeechContext.js
import React, { createContext, useState } from 'react';

export const SpeechContext = createContext();

export const SpeechProvider = ({ children }) => {
  // Only manage isListening and withRecording now
  const [isListening, setIsListening] = useState(false);
  const [withRecording, setWithRecording] = useState(false);

  return (
    <SpeechContext.Provider value={{ isListening, setIsListening, withRecording, setWithRecording }}>
      {children}
    </SpeechContext.Provider>
  );
};
