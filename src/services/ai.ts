import axios from 'axios';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';  // Replace with actual endpoint
const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;

export interface AIResponse {
  content: string;
  error?: string;
}

export const generateTitle = async (keyword: string): Promise<AIResponse> => {
  try {
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "You are a professional content writer specializing in SEO-optimized titles."
          },
          {
            role: "user",
            content: `Generate an engaging, SEO-friendly title for an article about: ${keyword}. The title should be concise and include the keyword naturally.`
          }
        ],
        temperature: 0.7,
        max_tokens: 50
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      content: response.data.choices[0].message.content.trim()
    };
  } catch (error) {
    console.error('AI Generation Error:', error);
    return {
      content: '',
      error: 'Failed to generate title. Please try again.'
    };
  }
}; 