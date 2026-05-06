import { GoogleGenAI } from '@google/genai';
import { CohortRow, InsightReport } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const analyzeRetention = async (data: CohortRow[]): Promise<InsightReport[]> => {
  if (!process.env.GEMINI_API_KEY) {
    return [
      {
        title: "API Key Missing",
        observation: "Gemini API key is not configured.",
        recommendation: "Please set GEMINI_API_KEY in the Secrets panel to enable AI analysis.",
        impact: "Medium"
      }
    ];
  }

  const prompt = `
    Analyze this subscription retention cohort data and provide 3-4 professional insights.
    Data: ${JSON.stringify(data.map(d => ({ name: d.cohortName, r: d.retention })))}
    
    Return your response as a valid JSON array of InsightReport objects:
    interface InsightReport {
      title: string;
      observation: string;
      recommendation: string;
      impact: 'High' | 'Medium' | 'Low';
    }
    
    Focus on:
    1. Early churn (Month 1-2).
    2. Cohort quality trends (are newer cohorts better?).
    3. Long-term stabilization.
    
    Only return the JSON array within [] brackets. No markdown formatting.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    
    const text = response.text || '';
    // Use regex to find the JSON array if there's markdown around it
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Could not parse AI response');
  } catch (error) {
    console.error('Gemini Analysis Error:', error);
    return [
      {
        title: "Analysis Pause",
        observation: "Computational limits or network error occurred during cohort analysis.",
        recommendation: "Retry the analysis or check data ingestion logs.",
        impact: "Low"
      }
    ];
  }
};
