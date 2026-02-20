const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function main() {
  try {
    // The new SDK might use different method signatures. 
    // Trying standard listModels pattern or checking via direct call if SDK allows.
    // Based on recent SDK changes, it might be ai.models.list()
    // but let's try to inspect what we can get.
    
    console.log("Attempting to list models...");
    const response = await ai.models.list();
    
    // response might be an async iterable or just an object
    for await (const model of response) {
        console.log(`Model: ${model.name}`);
        console.log(`Supported generation methods: ${model.supportedGenerationMethods}`);
    }

  } catch (err) {
    console.error("Error listing models:", err);
  }
}

main();
