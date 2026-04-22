require('dotenv').config(); 

global.ownername = "Musaasizi Marvin";
global.botname = "Cohenz Pro Bot";
global.sudo = ["256709913725"];
global.owner = ["256709913725"];
global.packname = "Cohenz Pro";
global.author = "iMac Recordz";
global.prefix = ".";

// SETTINGS
global.public_mode = true; 
global.gemini_api_key = process.env.GEMINI_API_KEY || "no_key";

module.exports = {
  sessionName: "session"
};

