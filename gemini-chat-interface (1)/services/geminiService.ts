
import { GoogleGenAI, Type } from "@google/genai";
import type { ChatMessage } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Function to convert our app's chat message format to Gemini's format
const toGeminiHistory = (history: ChatMessage[]) => {
  return history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }],
  }));
};

export const streamChatResponse = async (
  prompt: string,
  history: ChatMessage[],
  onChunk: (chunk: string) => void
): Promise<void> => {
  const model = ai.chats.create({
    model: 'gemini-2.5-flash',
    history: toGeminiHistory(history.slice(0, -1)), // Send history up to the user's latest message
  });

  const stream = await model.sendMessageStream({ message: prompt });

  for await (const chunk of stream) {
    if (chunk.text) {
      onChunk(chunk.text);
    }
  }
};

export const generateWorkflow = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Create a detailed step-by-step workflow for the following task: ${prompt}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        workflowTitle: {
                            type: Type.STRING,
                            description: "A concise title for the entire workflow."
                        },
                        steps: {
                            type: Type.ARRAY,
                            description: "The sequence of steps in the workflow.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    step: {
                                        type: Type.INTEGER,
                                        description: "The step number."
                                    },
                                    title: {
                                        type: Type.STRING,
                                        description: "A short title for this step."
                                    },
                                    description: {
                                        type: Type.STRING,
                                        description: "A detailed description of what to do in this step."
                                    }
                                },
                                required: ["step", "title", "description"]
                            }
                        }
                    },
                    required: ["workflowTitle", "steps"]
                },
            },
        });

        const jsonText = response.text.trim();
        const workflowData = JSON.parse(jsonText);

        if (!workflowData.workflowTitle || !workflowData.steps) {
            throw new Error("Invalid workflow data structure from API.");
        }

        let formattedWorkflow = `**${workflowData.workflowTitle}**\n\n`;
        const sortedSteps = workflowData.steps.sort((a: any, b: any) => a.step - b.step);

        for (const item of sortedSteps) {
            formattedWorkflow += `**${item.step}. ${item.title}**\n`;
            formattedWorkflow += `${item.description}\n\n`;
        }

        return formattedWorkflow.trim();
    } catch (error) {
        console.error("Error generating workflow:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate workflow. ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating the workflow.");
    }
};
