import { GoogleGenAI } from "@google/genai";

// Initialize the client. 
// NOTE: In a real production app, this key should be proxied through a backend.
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateOutreachMessage = async (
  propertyTitle: string,
  channel: string,
  tone: string,
  recipientName: string
): Promise<string> => {
  if (!apiKey) return "Error: API Key is missing. Please configure process.env.API_KEY.";

  const prompt = `
    You are an expert real estate copywriter for PropelliQ AI in Dubai.
    Write a ${tone} outreach message for ${channel}.
    
    Context:
    - Property: ${propertyTitle}
    - Recipient: ${recipientName}
    - Goal: Schedule a viewing or discuss investment potential.
    
    Constraints:
    - If WhatsApp/SMS: Keep it under 50 words, friendly, include 1 emoji.
    - If Email: Subject line + Body, professional but persuasive, max 150 words.
    - Mention "DLD Verified" to build trust.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Could not generate content.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating message. Please check your API key or connection.";
  }
};

export const optimizeTemplateText = async (currentText: string, instruction: string): Promise<string> => {
  if (!apiKey) return currentText;

  const prompt = `
    You are an AI editor for real estate communications.
    Optimize the following template text based on this instruction: "${instruction}".
    
    Current Text:
    "${currentText}"
    
    Keep the variables like {{name}} intact. Return ONLY the new text.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text?.trim() || currentText;
  } catch (error) {
    console.error("Gemini Template Error:", error);
    return currentText;
  }
};

export const predictLeadScore = async (propertyData: any): Promise<{ score: number; rationale: string }> => {
  if (!apiKey) return { score: 0, rationale: "API Key missing" };

  const prompt = `
    Analyze this real estate lead and predict a conversion score (0-100).
    
    Data:
    ${JSON.stringify(propertyData)}
    
    Output strictly in JSON format:
    {
      "score": number,
      "rationale": "One short sentence explaining why."
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    
    const text = response.text;
    if (text) {
        return JSON.parse(text);
    }
    return { score: 50, rationale: "AI analysis failed." };
  } catch (error) {
    console.error("Gemini Scoring Error:", error);
    return { score: 0, rationale: "Error calling AI service." };
  }
};