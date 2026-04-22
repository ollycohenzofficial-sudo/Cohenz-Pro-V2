require('dotenv').config(); 

global.ownername = "Musaasizi Marvin";
global.botname = "Cohenz Pro Bot";
global.sudo = ["256709913725"];
global.owner = ["256709913725"];
global.packname = "Cohenz Pro";
global.author = "iMac Recordz";
global.prefix = ".";

// AI Settings - These pull from Hugging Face Secrets
global.gemini_api_key = process.env.GEMINI_API_KEY || "no_key";
global.gemini_model = "gemini-1.5-flash";

module.exports = {
  sessionName: "session"
};
