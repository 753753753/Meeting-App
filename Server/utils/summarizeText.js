import { GoogleGenAI } from "@google/genai";
// Initialize Gemini with your API key
const ai = new GoogleGenAI({ apiKey: process.env.GEMNI_AI_KEY });

// Function to generate AI summary
export async function getAIUpdatedNotes(transcript) {
  try {
    console.log("Ai started");
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents:
`You are an expert meeting assistant. Summarize the following meeting transcript into clear, concise, and user-friendly meeting notes.

Please include only the following sections:

1. Main Topics Discussed: List each topic with a short description.
2. Key Points and Decisions: Summarize important points and decisions for each topic.
3. Action Items: List tasks, assignees, and deadlines if mentioned. If none, omit this section.

Do not include disclaimers, repeated info, or extra headings like "Meeting Minutes" or dates.

Format the notes neatly using bullet points or numbered lists for easy reading.

Meeting Transcript: ${transcript}`

,
});
    return response.text;
  } catch (error) {
    console.error("Gemini AI error:", error);
    throw error;
  }
}
