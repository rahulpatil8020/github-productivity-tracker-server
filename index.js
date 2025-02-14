require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const apiKey = process.env.GOOGLE_API_KEY;

app.post("/summarize", async (req, res) => {
  const { diff } = req.body;

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: "You are a code assistant. Summarize the following git diff into a short, clear summary, highlighting key changes in code structure, logic, and functionality. Omit minor details.",
          },
          { text: diff },
        ],
      },
    ],
  };

  try {
    const response = await axios.post(apiUrl, requestBody, {
      headers: { "Content-Type": "application/json" },
    });

    const summary =
      response.data?.candidates?.[0]?.content?.parts
        ?.map((part) => part.text)
        .join("") || "No summary available.";
    res.json({ summary });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Failed to generate summary." });
  }
});

const PORT = 8000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
