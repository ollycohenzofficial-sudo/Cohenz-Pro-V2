const Jimp = require('jimp');

module.exports = {
    name: 'blur',
    alias: ['removebg', 'nobg'],
    async start(m, { conn, command }) {
        // 1. Check if the user replied to an image
        const quoted = m.quoted ? m.quoted : m;
        const mime = (quoted.msg || quoted).mimetype || '';

        if (!/image/.test(mime)) {
            return m.reply("❌ Please reply to an image to use this command.");
        }

        m.reply(`🎨 *Cohenz Pro* is processing your ${command}...`);

        try {
            // 2. Download the media from WhatsApp
            const media = await quoted.download();

            if (command === 'blur') {
                // --- BLUR LOGIC ---
                const image = await Jimp.read(media);
                image.blur(10); // Standard blur intensity
                const buffer = await image.getBufferAsync(Jimp.MIME_PNG);

                await conn.sendMessage(m.chat, { 
                    image: buffer, 
                    caption: "✨ Image blurred by Cohenz Pro V2" 
                }, { quoted: m });

            } else if (command === 'removebg' || command === 'nobg') {
                // --- REMOVE BG LOGIC ---
                // Note: This usually requires a paid API. 
                // If you don't have one, we show a helpful error.
                if (!global.removebg_key || global.removebg_key === 'no_key') {
                    return m.reply("⚠️ Background removal requires an API key. Please add 'REMOVEBG_KEY' to your config/secrets.");
                }
                
                // (Optional: Code for RemoveBG API would go here)
                m.reply("Feature coming soon! Use .blur for now.");
            }

        } catch (e) {
            console.error(e);
            m.reply("❌ Failed to process image. Make sure the file isn't too large.");
        }
    }
};
