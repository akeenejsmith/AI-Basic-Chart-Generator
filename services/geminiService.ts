
import { GoogleGenAI, Type } from '@google/genai';
import { ChartType, GeminiResponse } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getPromptAndSchema = (topic: string, chartType: ChartType) => {
  switch (chartType) {
    case ChartType.PIE:
      return {
        prompt: `Generate sample JSON data for a Pie chart about "${topic}". The data should be an array of objects. Each object must have a "name" property (string) for the label, a "value" property (number), and a "fill" property (a unique, vibrant hex color string). Provide a JSON object with a single key "data" containing this array.`,
        schema: {
          type: Type.OBJECT,
          properties: {
            data: {
              type: Type.ARRAY,
              description: 'An array of data points for the pie chart.',
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: 'The label for the slice.' },
                  value: { type: Type.NUMBER, description: 'The numerical value of the slice.' },
                  fill: { type: Type.STRING, description: 'The hex color for the slice.' },
                },
                required: ['name', 'value', 'fill'],
              },
            },
          },
        },
      };
    case ChartType.BAR:
    case ChartType.LINE:
    default:
      return {
        prompt: `Generate sample JSON data for a ${chartType} chart about "${topic}". The response must be a JSON object with two keys: "data" and "keys".
1. "data": An array of at least 5 objects. Each object must have a string "name" property for the x-axis label, and one or two other numeric properties for the y-axis values (e.g., "sales", "users"). The key names for these numeric properties should be consistent across all objects.
2. "keys": An array of objects describing the numeric properties. Each object must have a "dataKey" (string, matching a numeric key in the "data" objects) and a "color" (a unique, vibrant hex color string).`,
        schema: {
          type: Type.OBJECT,
          properties: {
            data: {
              type: Type.ARRAY,
              description: `An array of data points for the ${chartType} chart.`,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: 'The label for the x-axis.' },
                },
                // Let Gemini define the other numeric properties
              },
            },
            keys: {
              type: Type.ARRAY,
              description: 'An array of objects describing the data keys and their colors.',
              items: {
                type: Type.OBJECT,
                properties: {
                  dataKey: { type: Type.STRING, description: 'The key for the data value.' },
                  color: { type: Type.STRING, description: 'The hex color for this data series.' },
                },
                required: ['dataKey', 'color'],
              },
            },
          },
          required: ['data', 'keys'],
        },
      };
  }
};

export const generateChartData = async (
  topic: string,
  chartType: ChartType
): Promise<GeminiResponse> => {
  const { prompt, schema } = getPromptAndSchema(topic, chartType);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema,
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
      throw new Error('API returned an empty response.');
    }
    
    const parsedData = JSON.parse(jsonText);
    
    // Basic validation
    if (typeof parsedData !== 'object' || !parsedData.data || !Array.isArray(parsedData.data)) {
        throw new Error('AI response is missing the "data" array.');
    }

    return parsedData as GeminiResponse;

  } catch (error) {
    console.error('Error fetching or parsing data from Gemini API:', error);
    throw new Error('Failed to communicate with the AI model. Please check your API key and try again.');
  }
};
