// utils/speechRecognition.js
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();

recognition.continuous = true;
recognition.interimResults = false; // Set to `true` if you want live typing
recognition.lang = 'en-US';
recognition.maxAlternatives = 1;

export default recognition;
