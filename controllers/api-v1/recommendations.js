// const authLockedRoute = require('./authLockedRoute')
const express = require('express')
const router = express.Router()
const openai = require('openai')

router.get('/', (req, res) => {
	res.json({ msg: 'welcome to the recs endpoint' })
})
// POST /api-v1/recommendations
router.post('/',  async (req, res) => {
  try {
    const { userId, preferences } = req.body

    const prompt = `As a user with ID ${userId}, I'm looking for festival recommendations. I enjoy ${preferences}.`

    const chatGPTResponse = await openai.complete({
        engine: 'text-davinci-003',
        prompt,
        maxTokens: 100,
        n: 3,
        stop: '\n'
    })
    const recommendations = chatGPTResponse.choices.map(choice => choice.text.trim())
    res.json({ recommendations })
    console.log('Recommendations route reached');
    console.log('Request Body:', req.body)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to generate recommendations' })
  }
})

module.exports = router
