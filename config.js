require('dotenv').config(); 

global.ownername = "Musaasizi Marvin";
global.botname = "Cohenz Pro Bot";
global.sudo = ["256709913725"];
global.owner = ["256709913725"];
global.packname = "Cohenz Pro";
global.author = "iMac Recordz";
global.prefix = ".";

global.ownername = "Musaasizi Marvin";
// ... (rest of your config)
global.warn_limit = 3; // User gets kicked on the 3rd warning

// SETTINGS
global.public_mode = true; 
global.antibad = false; // Default off
global.gemini_api_key = process.env.GEMINI_API_KEY || "no_key";

module.exports = {
  sessionName: "session"
};
