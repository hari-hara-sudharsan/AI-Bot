import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

// OpenAI setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This will be added in Vercel settings
});

// AI Bot Endpoint
app.post("/solveDSA", async (req, res) => {
  try {
    const question = req.body.question || "Explain quicksort in simple terms";

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a DSA tutor. Answer clearly with examples." },
        { role: "user", content: question }
      ],
      max_tokens: 500
    });

    res.json({ answer: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`AI Bot running on port ${PORT}`));
