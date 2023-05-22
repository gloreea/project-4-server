const express = require('express')
const router = express.Router()
const axios = require('axios')

// GET /api-v1/festivals
router.get('/', async (req, res) => {
  try {
    const response = await axios.get('https://app.ticketmaster.com/discovery/v2/events.json/', {
      params: {
        apikey: process.env.API_KEY,
        keyword: 'music festival',
      },
    })
    const festivals = response.data;

    res.json(festivals)
    console.log(process.env.API_KEY)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to fetch festivals' })
  }
})

module.exports = router