import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    // ✅ Allow only POST requests
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { question } = req.body;

    // ✅ Validate input
    if (!question || typeof question !== "string" || question.trim() === "") {
      return res.status(400).json({ error: "Please provide a valid question" });
    }

    // ✅ Initialize OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // Stored in Vercel Environment Variables
    });

    // ✅ Create completion
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Fast + cheap model
      messages: [
        {
          role: "system",
          content:
            "You are a helpful AI tutor for coding and DSA questions. Always explain step-by-step with examples.",
        },
        { role: "user", content: question },
      ],
      max_tokens: 500,
    });

    // ✅ Send response back
    return res.status(200).json({
      answer: completion.choices[0]?.message?.content || "No answer generated.",
    });
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    return res.status(500).json({ error: "Failed to get AI response" });
  }
}



