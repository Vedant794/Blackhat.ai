import { config } from "dotenv";
import Groq from "groq-sdk";
import express from "express";
import { systemPrompt } from "./systemPrompt.js";

config();

const app = express();
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post("/info", async (req, res) => {
  try {
    const message = await req.body.message;
    const response = await groq.chat.completions.create({
      messages: [
        { role: "user", content: message },
        {
          role: "system",
          content: systemPrompt,
        },
      ],
      model: "llama3-70b-8192",
      max_tokens: 1000,
    });

    res.status(201).json({ response: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ "Error in post message:": error.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server Started at ${PORT} number`));
