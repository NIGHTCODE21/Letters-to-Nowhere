// server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const OpenAI = require("openai"); // ✅ Correct way for v5+
const path = require("path"); 
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Serve frontend files
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// OpenAI setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST /reply
app.post("/reply", async (req, res) => {
  const { secret } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // ✅ This works with your key

      messages: [
        {
          role: "system",
          content:
            "You are a comforting friend. Reply empathetically, supportively, and kindly when someone shares something painful or emotional.",
        },
        {
          role: "user",
          content: secret,
        },
      ],
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("OpenAI error:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
