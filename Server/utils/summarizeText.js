export const getAIUpdatedNotes = async (transcript) => {
  const apiKey = process.env.HUGGING_FACE_API_KEY; // Your Hugging Face API key
  console.log("heloo ai")
  try {
    const response = await fetch('https://api-inference.huggingface.co/models/facebook/bart-large-cnn', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: transcript,
      }),
    });

    // Parse the response from Hugging Face API
    const data = await response.json();
    
    // Return the summarized text
    return data[0].summary_text;
  } catch (error) {
    console.error('Error during summarization:', error);
    throw new Error('Failed to generate summary');
  }
};
