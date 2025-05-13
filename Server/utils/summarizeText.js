// summarizeText.js
const fetch = require('node-fetch'); // if needed, install with `npm i node-fetch`

const getAIUpdatedNotes = async (transcript) => {
  const apiKey = process.env.HUGGING_FACE_API_KEY;
  console.log("hello ai");
  try {
    const response = await fetch('https://api-inference.huggingface.co/models/facebook/bart-large-cnn', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: transcript }),
    });

    const data = await response.json();
    return data[0].summary_text;
  } catch (error) {
    console.error('Error during summarization:', error);
    throw new Error('Failed to generate summary');
  }
};

module.exports = { getAIUpdatedNotes };
