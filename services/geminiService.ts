import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || ''; // Assumption: configured in environment
const ai = new GoogleGenAI({ apiKey });

export const explainCode = async (code: string): Promise<string> => {
    try {
        const model = 'gemini-2.5-flash';
        const prompt = `
        You are an expert compiler engineer for the 'Bojro' (বজ্র) programming language.
        It is a Bengali-based language with syntax similar to C/C++.
        
        Keywords:
        - print -> লিখো
        - int -> পূর্ণসংখ্যা
        - if -> যদি
        - else -> নতুবা
        - loop/while -> যতক্ষণ
        
        Please analyze the following code and explain what it does in English, but use the Bengali keywords when referencing specific parts of the code. Keep it brief and helpful for a learner.

        Code:
        ${code}
        `;

        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });

        return response.text || "No explanation available.";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Could not connect to AI service. Please check your API Key.";
    }
};

export const suggestOptimization = async (code: string): Promise<string> => {
    try {
        const model = 'gemini-2.5-flash';
        const prompt = `
        Refactor the following 'Bojro' (Bengali programming language) code to be more efficient or cleaner.
        Only output the code, nothing else.
        
        Code:
        ${code}
        `;

        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });

        return response.text || code;
    } catch (error) {
        return code;
    }
}