import OpenAI from "openai";

export default async function handler(req, res) {
  console.log("Request method:", req.method); // Debug log

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { question } = req.body;
  console.log("Question received:", question); // Debug log

  if (!question) {
    return res.status(400).json({ error: "No question provided" });
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful AI tutor for coding and DSA questions. Explain step-by-step with examples.",
        },
        { role: "user", content: question },
      ],
      max_tokens: 500,
    });

    console.log("OpenAI response:", completion.choices[0].message.content); // Debug log

    res.status(200).json({ answer: completion.choices[0].message.content });
  } catch (error) {
    console.error("Error calling OpenAI:", error); // Debug log
    res.status(500).json({ error: error.message });
  }
}



