const axios = require('axios');

module.exports = {
    name: 'gemini',
    alias: ['ai', 'ask', 'bot'],
    description: 'Chat with Gemini AI',
    async start(m, { text }) { // Changed 'execute' to 'start' to match your index.js
        if (!text) return m.reply("Yo! Ask me something. Example: .gemini How do I mix a Ugaflow track?");

        const apiKey = global.gemini_api_key;
        // Using the flash model for speed
        const model = "gemini-1.5-flash";

        if (!apiKey || apiKey === "no_key") {
            return m.reply("Master, the Gemini API key is missing! Add it to Hugging Face Secrets.");
        }

        try {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
                {
                    contents: [{ parts: [{ text: text }] }]
                }
            );

            const aiResponse = response.data.candidates[0].content.parts[0].text;
            
            await m.reply(aiResponse);

        } catch (e) {
            console.error(e);
            m.reply("AI is currently offline or the API key is invalid.");
        }
    }
};

