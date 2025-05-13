import React, { createContext, useState } from 'react';

// Create the SpeechContext
export const SpeechContext = createContext();

export const SpeechProvider = ({ children }) => {
  // State to manage transcript, listening state, and withRecording
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [withRecording, setWithRecording] = useState(false); // Add state for withRecording

  return (
    <SpeechContext.Provider value={{ transcript, setTranscript, isListening, setIsListening, withRecording, setWithRecording }}>
      {children}
    </SpeechContext.Provider>
  );
};
