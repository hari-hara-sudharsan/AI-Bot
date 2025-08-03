import OpenAI from "openai";

export default async function handler(req, res) {
  // Log the request method for debugging
  console.log("Request method:", req.method);

  // Allow only POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Get the question from request body
  const { question } = req.body;
  console.log("Question received:", question);

  // Validate the question
  if (!question) {
    return res.status(400).json({ error: "No question provided" });
  }

  try {
    // Create OpenAI client with your API key from Vercel env variables
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Request OpenAI for a completion
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Good balance of cost and speed
      messages: [
        {
          role: "system",
          content:
            "You are a helpful AI tutor for coding and DSA questions. Explain concepts clearly with examples.",
        },
        { role: "user", content: question },
      ],
      max_tokens: 500,
    });

    // Log and return the AI's answer
    const answer = completion.choices[0]?.message?.content || "No answer generated.";
    console.log("OpenAI Answer:", answer);

    res.status(200).json({ answer });
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    res.status(500).json({ error: error.message });
  }
}
