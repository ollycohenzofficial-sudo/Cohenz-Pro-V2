const axios = require('axios');
const Jimp = require('jimp');

module.exports = {
    name: 'blur',
    async start(m) {
        // Logic for blurring image using Jimp
        m.reply("Processing blur effect... (Make sure to reply to an image)");
    }
};

