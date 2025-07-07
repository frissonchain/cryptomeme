export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;

  console.log("Prompt received:", prompt);

  if (!prompt || prompt.trim().length < 10) {
    return res.status(400).json({ error: "Invalid prompt" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "Missing OpenAI API key" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        prompt,
        model: "dall-e-2",
        n: 1,
        size: "1024x1024"
      }),
    });

    const data = await response.json();
    console.log("Raw response from OpenAI:", data);

    if (!response.ok || !data.data || !data.data[0]?.url) {
      return res.status(500).json({ error: "Failed to generate image", detail: data });
    }

    res.status(200).json({ url: data.data[0].url });
  } catch (err) {
    console.error("Request error:", err);
    res.status(500).json({ error: "Unexpected server error" });
  }
}