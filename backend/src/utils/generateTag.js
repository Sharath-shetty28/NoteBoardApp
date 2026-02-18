import axios from "axios";

export const generateTags = async (title, content) => {
  try {
    const safeContent = content.slice(0, 3000);

    const prompt = `
Generate 4 short tags (1-2 words each).
Return ONLY a valid JSON array.

Title: ${title}
Content: ${safeContent}
`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "qwen/qwen3-32b",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      },
    );

    const raw = response.data.choices[0].message.content.trim();
    const match = raw.match(/\[.*?\]/s);
    if (!match) throw new Error("No JSON array found");

    const tags = JSON.parse(match[0]);

    return Array.isArray(tags) ? tags.slice(0, 4) : ["general"];
  } catch (error) {
    console.error(
      "Tag generation failed:",
      error.response?.data || error.message,
    );
    return ["general"];
  }
};
