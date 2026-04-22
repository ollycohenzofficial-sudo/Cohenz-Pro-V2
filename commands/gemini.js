const axios = require('axios');

module.exports = {
    name: 'gemini',
    alias: ['ai', 'ask', 'bot'],
    description: 'Chat with Gemini AI',
    async execute(m, { text, args }) {
        if (!text) return m.reply("Yo! Ask me something. Example: .gemini How do I mix a Ugaflow track?");

        // Use the key we set in config.js
        const apiKey = global.gemini_api_key;
        const model = global.gemini_model || "gemini-1.5-flash";

        if (!apiKey) return m.reply("Master, the Gemini API key is missing in the settings!");

        try {
            // Sending the request to Google Gemini API
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
                {
                    contents: [{ parts: [{ text: text }] }]
                }
            );

            const aiResponse = response.data.candidates[0].content.parts[0].text;
            
            // Send the AI's answer back to WhatsApp
            await m.reply(aiResponse);

        } catch (e) {
            console.error(e);
            m.reply("Check the logs—something went wrong with the AI connection.");
        }
    }
};

