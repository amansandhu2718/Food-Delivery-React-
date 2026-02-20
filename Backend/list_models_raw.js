const https = require('https');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("API Key is missing from .env");
  process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (json.error) {
          console.error("API Error:", json.error);
      } else if (json.models) {
          console.log("Available Models:");
          json.models.forEach(m => {
             // Filter for generateContent supported models
             if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                 console.log(`- ${m.name}`);
             }
          });
      } else {
          console.log("Unexpected response:", json);
      }
    } catch (e) {
      console.error("Error parsing JSON:", e);
      console.log("Raw Response:", data);
    }
  });

}).on('error', (err) => {
  console.error("Request Error:", err);
});
