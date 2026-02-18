/**
 * OpenAI Service - Direct API integration
 * Handles LLM requests for educational content generation
 */

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export const openAIService = {
    /**
     * Invoke OpenAI LLM with a prompt
     * @param {string} prompt - The prompt to send to the LLM
     * @param {object} options - Optional configuration
     * @returns {Promise<string>} - The LLM response content
     */
    async invoke(prompt, options = {}) {
        const {
            model = 'gpt-3.5-turbo',
            maxTokens = 500,
            temperature = 0.7,
            systemPrompt = 'You are a helpful educational assistant for children learning technology.',
        } = options;

        if (!OPENAI_API_KEY) {
            throw new Error('OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your .env.local file');
        }

        try {
            const response = await fetch(OPENAI_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                    model,
                    messages: [
                        {
                            role: 'system',
                            content: systemPrompt,
                        },
                        {
                            role: 'user',
                            content: prompt,
                        },
                    ],
                    max_tokens: maxTokens,
                    temperature,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'OpenAI API request failed');
            }

            const data = await response.json();
            const content = data.choices[0]?.message?.content || '';

            return {
                content,
                model,
                usage: data.usage,
            };
        } catch (error) {
            console.error('OpenAI API Error:', error);
            throw error;
        }
    },

    /**
     * Generate educational content
     */
    async generateEducationalContent(topic, difficulty = 'beginner') {
        const prompt = `Generate a fun and educational explanation about ${topic} suitable for ${difficulty} level students. Keep it engaging and easy to understand.`;

        const result = await this.invoke(prompt, {
            temperature: 0.8,
            maxTokens: 300,
        });

        return result.content;
    },

    /**
     * Generate a quiz question
     */
    async generateQuizQuestion(topic, difficulty = 'medium') {
        const prompt = `Create a multiple-choice quiz question about ${topic} for ${difficulty} level students. Format: Question, then 4 options (A, B, C, D), then the correct answer.`;

        const result = await this.invoke(prompt, {
            temperature: 0.7,
            maxTokens: 200,
        });

        return result.content;
    },

    /**
     * Generate a fun fact
     */
    async generateFunFact(topic = 'technology') {
        const prompt = `Generate a fun and interesting fact about ${topic} that would excite children learning about technology.`;

        const result = await this.invoke(prompt, {
            temperature: 0.9,
            maxTokens: 150,
        });

        return result.content;
    },

    /**
     * Generate a coding challenge
     */
    async generateCodingChallenge(language, difficulty = 'beginner') {
        const prompt = `Create a ${difficulty} level coding challenge for ${language}. Include: 1) Problem description, 2) Example input/output, 3) Hints.`;

        const result = await this.invoke(prompt, {
            temperature: 0.7,
            maxTokens: 400,
        });

        return result.content;
    },
};
