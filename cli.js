

const readline = require('readline');
const axios = require('axios');

const apiUrl = 'http://localhost:3000/ask'; // Adjust the URL if you changed the port or hosted it differently

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = async (question) => {
 
  try {
    const response = await axios.post(apiUrl, { input: question }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(response.data.bot.content);
  } catch (error) {
   
    console.error('Error:', error.message);
  }
};

const userPrompt = "you :";
const botPrompt = "Bot :";

rl.setPrompt(userPrompt);
rl.prompt();

rl.on('line', (input) => {
  askQuestion(input.trim());
  rl.setPrompt(botPrompt);
  rl.prompt();
});


rl.on('close', () => {
  console.log('Exiting...');
  process.exit(0);
});
