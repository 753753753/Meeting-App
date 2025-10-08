import { GoogleGenAI } from "@google/genai";
// Initialize Gemini with your API key
const ai = new GoogleGenAI({ apiKey: process.env.GEMNI_AI_KEY });

// Function to generate AI summary
export async function getAIUpdatedNotes(transcript) {
  console.log(transcript)
  try {
    console.log("AI started");
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `
You are an expert AI meeting summarizer.

Convert the following raw, multilingual meeting transcript into professional English meeting notes.

### Guidelines:
- Translate Hindi or other languages into fluent English.
- Fix minor errors, grammar, or incomplete sentences.
- If a sentence is unclear, infer **lightly** using only the nearby context.
- Do not fabricate new topics, data, or decisions.
- Keep it concise, factual, and well-formatted.

### Structure:
1. 📚 **Main Topics Discussed**
2. ✅ **Key Points and Decisions**
3. 📝 **Action Items**

### Transcript:
${transcript.content}
  `,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini AI error:", error);
    throw error;
  }
}

