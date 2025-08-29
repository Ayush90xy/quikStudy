// const axios = require('axios');

// const openaiClient = (apiKey) => {
//   // Uses OpenAI Chat Completions (compatible). Replace model as desired.
//   const baseURL = 'https://api.openai.com/v1/chat/completions';
//   const headers = { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' };
//   return async ({ messages, model = 'gpt-4o-mini', temperature = 0.3 }) => {
//     const { data } = await axios.post(
//       baseURL,
//       { model, messages, temperature },
//       { headers }
//     );
//     return data.choices?.[0]?.message?.content?.trim() || '';
//   };
// };

// exports.handleAI = async (req, res) => {
//   try {
//     const { feature } = req.params;
//     const { text, language = 'Spanish' } = req.body || {};
//     if (!process.env.AI_API_KEY) return res.status(500).json({ message: 'AI API key not set' });
//     const run = openaiClient(process.env.AI_API_KEY);

//     if (!text && feature !== 'auto-suggest')
//       return res.status(400).json({ message: 'Text is required' });

//     let prompt;
//     if (feature === 'summarize') {
//       prompt = [
//         { role: 'system', content: 'You are a helpful assistant that summarizes study notes concisely.' },
//         { role: 'user', content: `Summarize this for revision as bullet points:\n\n${text}` }
//       ];
//     } else if (feature === 'translate') {
//       prompt = [
//         { role: 'system', content: 'You translate text, preserving meaning and formatting.' },
//         { role: 'user', content: `Translate this into ${language}:\n\n${text}` }
//       ];
//     } else if (feature === 'auto-suggest') {
//       const partial = (req.body?.partial || '').toString();
//       if (!partial) return res.status(400).json({ message: 'Partial text required' });
//       prompt = [
//         { role: 'system', content: 'Autocomplete the next few words of the sentence, keep it short (<= 12 words).' },
//         { role: 'user', content: partial }
//       ];
//     } else {
//       return res.status(404).json({ message: 'Unknown feature' });
//     }

//     const output = await run({ messages: prompt });
//     res.json({ result: output });
//   } catch (e) {
//     console.error(e?.response?.data || e.message);
//     res.status(500).json({ message: 'AI service error', detail: e?.response?.data || e.message });
//   }
// };

const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function handleAI(req, res) {
  try {
    const { feature } = req.params;
    const { text, language = "Spanish", partial } = req.body || {};

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: "Gemini API key not set" });
    }

    let prompt;
    if (feature === "summarize") {
      prompt = `Summarize this for revision as bullet points:\n\n${text}`;
    } else if (feature === "translate") {
      prompt = `Translate this into ${language}:\n\n${text}`;
    } else if (feature === "auto-suggest") {
      if (!partial) {
        return res.status(400).json({ message: "Partial text required" });
      }
      prompt = `Continue this text with intelligent suggestion:\n\n${partial}`;
    } else {
      return res.status(404).json({ message: "Unknown feature" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const output = result.response.text();

    return res.json({ result: output });
  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ message: "Gemini API error", detail: err.message });
  }
}

module.exports = { handleAI };
