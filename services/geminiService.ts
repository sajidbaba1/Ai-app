import { GoogleGenAI } from "@google/genai";

let genAI: GoogleGenAI | null = null;

const getAIClient = (): GoogleGenAI => {
  if (!genAI) {
    if (!process.env.API_KEY) {
      throw new Error("API Key not found");
    }
    genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return genAI;
};

export const generateSqlFromQuestion = async (question: string): Promise<string> => {
  try {
    const ai = getAIClient();
    const prompt = `
      You are a PostgreSQL expert. Convert the following natural language question into a standard SQL query.
      The table name is 'students'.
      The schema is:
      - id (integer)
      - first_name (varchar)
      - last_name (varchar)
      - email (varchar)
      - major (varchar)
      - gpa (float)
      - status (varchar: 'Active', 'Probation', 'Graduated', 'Dropped')
      - enrollment_date (date)

      Question: "${question}"

      Return ONLY the raw SQL string. Do not use Markdown formatting (no \`\`\`sql).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text.trim().replace(/```sql/g, '').replace(/```/g, '');
  } catch (error) {
    console.error("Error generating SQL:", error);
    throw new Error("Failed to generate SQL from your question.");
  }
};

export const analyzeStudentData = async (data: any[]): Promise<string> => {
  try {
    const ai = getAIClient();
    const prompt = `
      Analyze the following student data and provide 3 key insights or trends in a concise markdown list format.
      Focus on GPA trends, Major distribution, or Status risks.
      
      Data: ${JSON.stringify(data.slice(0, 20))}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error analyzing data:", error);
    return "Could not generate analysis at this time.";
  }
};
