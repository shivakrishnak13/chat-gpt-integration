const express = require('express');
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(cors())
const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});

const openai = new OpenAIApi(configuration);

app.use(express.json());

app.post('/ask', async (req, res) => {
  const { input } = req.body;
  console.log({ input });

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: input,
        },
      ],
    });
    return res.status(200).json({ bot: response.data.choices[0].message });
  } catch (error) {
    console.error('Error communicating with the OpenAI API:', error.message);
    res.status(500).json({ error: 'Something went wrong',error});
  }
});

const history = [];
app.post('/joke', async (req, res) => {
  const user_input = req.body.message;

  const messages = [];
  for (const [input_text, completion_text] of history) {
    messages.push({ role: 'user', content: input_text });
    messages.push({ role: 'assistant', content: completion_text });
  }

  messages.push({ role: 'user', content: `Tell me a joke and the joke is ${user_input}` });

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: messages,
    });

    const completion_text = completion.data.choices[0].message.content;

    history.push([user_input, completion_text]);

    res.json({ message: completion_text });
  } catch (error) {
    console.error('Error communicating with the OpenAI API:', error.message);
    res.status(500).json({ error: 'An error occurred while processing the request.', message: error.message });
  }
});



// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
