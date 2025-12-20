
import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client
// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const aiService = {
  /**
   * Refines Tamil text (poems/stories) for better vocabulary and grammar.
   */
  async refineTamilText(content: string, category: string): Promise<string> {
    try {
      // Use ai.models.generateContent to query GenAI with both the model name and prompt.
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are an expert Tamil literary scholar. Refine the following ${category} for better vocabulary, flow, and grammatical correctness while preserving the original emotion and meaning. Return ONLY the refined Tamil text.
        
        Content: ${content}`,
      });
      // The GenerateContentResponse object features a text property (not a method) that directly returns the string output.
      return response.text || content;
    } catch (error) {
      console.error("AI Refinement Error:", error);
      return content;
    }
  },

  /**
   * Generates a short summary of a Tamil article or story.
   */
  async summarizePost(title: string, content: string): Promise<string> {
    try {
      // Use ai.models.generateContent to query GenAI with both the model name and prompt.
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Summarize the following Tamil story/article titled "${title}" in exactly 2-3 concise Tamil sentences. Focus on the core message or plot.
        
        Content: ${content}`,
      });
      // The GenerateContentResponse object features a text property (not a method) that directly returns the string output.
      return response.text || "சுருக்கம் கிடைக்கவில்லை.";
    } catch (error) {
      console.error("AI Summary Error:", error);
      return "மன்னிக்கவும், சுருக்கத்தை உருவாக்குவதில் பிழை ஏற்பட்டது.";
    }
  }
};
