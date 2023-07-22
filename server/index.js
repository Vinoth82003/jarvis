// server/index.js
import express from "express";
import { config } from "dotenv"; // Import config from dotenv
import { Configuration, OpenAIApi } from "openai";
import readline from "readline";

// Load the environment variables from .env file
config();

const app = express();
const port = process.env.PORT || 3000;
const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.API_KEY, // Access the API key from environment variable
  })
);

const userInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

app.use(express.static("public"));

app.post("/api/chat", express.json(), async (req, res) => {
  const { input } = req.body;
  const output = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: input }],
  });

  res.json({ response: output.data.choices[0].message.content });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  userInterface.prompt();
  userInterface.on("line", async (input) => {
    const response = await askOpenAI(input);
    console.log(response);
    userInterface.prompt();
  });
});

function askOpenAI(input) {
  return new Promise((resolve) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input }),
    };

    fetch("/api/chat", requestOptions)
      .then((response) => response.json())
      .then((data) => resolve(data.response))
      .catch((error) => console.error("Error:", error));
  });
}
