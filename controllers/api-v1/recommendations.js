// const authLockedRoute = require('./authLockedRoute')
const express = require('express');
const router = express.Router();
const { Configuration, OpenAIApi } = require('openai');

const openaiAPIKey = process.env.OPENAI_API_KEY;
const configuration = new Configuration({
  apiKey: openaiAPIKey,
});
const openai = new OpenAIApi(configuration);

router.get('/', (req, res) => {
  res.json({ msg: 'Welcome to the recs endpoint' });
});

// POST /api-v1/recommendations
router.post('/', async (req, res) => {
  try {
    const { userId, preferences } = req.body;

    const prompt = `As a user with ID ${userId}, I'm looking for festival recommendations. I enjoy ${preferences}.`

    const chatGPTResponse = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' }, 
        { role: 'user', content: prompt }],
    });
    console.log(chatGPTResponse)
    console.log(chatGPTResponse.data.choices[0].message.content)
    const recommendations = chatGPTResponse.data.choices[0].message.content
    console.log(recommendations)
    res.json({ recommendations })
    // res.json({ chatGPTResponse })
    // console.log(chatGPTResponse.choices[0].message)
    console.log('Recommendations route reached')
    // console.log('Request Body:', req.body)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
})

module.exports = router
