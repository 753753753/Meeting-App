import { GoogleGenAI } from "@google/genai";
// Initialize Gemini with your API key
const ai = new GoogleGenAI({ apiKey: process.env.GEMNI_AI_KEY });

// Function to generate AI summary
export async function getAIUpdatedNotes(transcript) {
  try {
    console.log("AI started");
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `
You are an expert meeting assistant, translator, and educator.

Your job is to convert the following multi-language, partially broken meeting transcript into clean, high-quality meeting notes in English.

### Requirements:
- Fill in missing or unclear parts using best inference based on the meeting context and title: .
- Translate any non-English content (e.g., Hindi) into **clear, fluent English**.
- Add helpful context or missing details related to the meeting title to improve clarity.
- Provide simple definitions or context for technical terms.
- Format under these exact sections:

  1. 📚 **Main Topics Discussed**
     - Include topic names and brief definitions/explanations.
  
  2. ✅ **Key Points and Decisions**
     - List any decisions or agreements made.
  
  3. 📝 **Action Items**
     - Include who needs to do what and any deadlines (if mentioned).

Avoid greetings, disclaimers, or unnecessary text.

### Transcript:
${transcript}
      `,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini AI error:", error);
    throw error;
  }
}

