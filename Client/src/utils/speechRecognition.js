// src/utils/speechRecognition.js
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.lang = 'en-US';
recognition.interimResults = true; // Must be true for live transcription
