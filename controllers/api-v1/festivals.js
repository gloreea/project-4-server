const express = require('express')
const router = express.Router()
const axios = require('axios')

// GET /api-v1/festivals
router.get('/', async (req, res) => {
  try {
    // Perform the necessary logic to fetch festival/event data
    const response = await axios.get('https://app.ticketmaster.com/discovery/v2/events.json', {
      params: {
        apikey: process.env.API_KEY,
        keyword: 'music festival',
      },
    })
    const festivals = response.data;

    res.json(festivals)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch festivals' })
  }
})

module.exports = router