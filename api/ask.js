import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: "No question provided" });
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // Your OpenAI key in Vercel env
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Fast + good for coding
      messages: [
        {
          role: "system",
          content: "You are a helpful AI tutor for coding and DSA questions. Explain step-by-step with examples.",
        },
        { role: "user", content: question },
      ],
      max_tokens: 500,
    });

    res.status(200).json({ answer: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


