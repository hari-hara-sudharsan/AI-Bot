// api/ask.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: "No question provided" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful tutor for coding and DSA questions." },
          { role: "user", content: question },
        ],
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    res.status(200).json({ answer: data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
