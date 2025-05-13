const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

exports.convertAudioToText = async (audioFilePath) => {
  // TODO: Implement audio to text conversion using Whisper API
  // Example using OpenAI Whisper API (replace with actual implementation)
  const response = await axios.post(
    'https://api.whisperapi.com/v1/audio',
    fs.createReadStream(audioFilePath),
    {
      headers: {
        Authorization: `Bearer ${process.env.WHISPER_API_KEY}`,
        'Content-Type': 'audio/mpeg',
      },
    }
  );
  return response.data.text;
};
