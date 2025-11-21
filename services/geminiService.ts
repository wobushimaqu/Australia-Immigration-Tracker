import { GoogleGenAI, Type } from "@google/genai";
import { Occupation } from "../types";

// Initialize Gemini Client
// Note: API Key must be provided via process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getOccupationInsights = async (occupation: Occupation): Promise<{ summary: string; advice: string[] }> => {
  try {
    const recentData = occupation.data[occupation.data.length - 1];
    const totalInvitesLastYear = occupation.data.reduce((acc, curr) => acc + curr.invitations, 0);
    
    const prompt = `
      You are an expert Australian Migration Agent. 
      Analyze the current situation for the occupation: "${occupation.title}" (ANZSCO Code: ${occupation.code}).
      
      Key Data Points:
      - Recent 189 Invitation Score: ${recentData.score189} points
      - Current Active Applications (Backlog): ${recentData.applications}
      - Total Invitations Issued (Last 12 Months): ${totalInvitesLastYear}
      
      Provide:
      1. A brief 2-sentence analysis of the competition, considering the score and the backlog volume.
      2. Three distinct, actionable bullet points on how an applicant can improve their chances.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            advice: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["summary", "advice"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) {
        throw new Error("Empty response from Gemini");
    }
    
    return JSON.parse(jsonText);

  } catch (error) {
    console.error("Error fetching Gemini insights:", error);
    return {
      summary: "Unable to generate real-time AI analysis. Based on general trends, this occupation requires a competitive score due to high demand.",
      advice: ["Maximize English points (PTE/IELTS)", "Claim partner skills points if applicable", "Consider state nomination (190/491)"]
    };
  }
};