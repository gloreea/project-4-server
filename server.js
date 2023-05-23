// require packages
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const rowdy = require('rowdy-logger')
const openai = require('openai')



// config express app
const app = express()
const PORT = process.env.PORT || 8000
// for debug logging 
const rowdyResults = rowdy.begin(app)
// cross origin resource sharing 
app.use(cors())
// request body parsing
app.use(express.json())

openai.api_key = process.env.OPENAI_API_KEY

// GET / -- test index route
app.get('/', (req, res) => {
    res.json({ msg: 'hello backend 🤖' })
})
console.log(process.env.API_KEY)
// controllers
app.use('/api-v1/users', require('./controllers/api-v1/users.js'))
app.use('/api-v1/recommendations', require('./controllers/api-v1/recommendations.js'))
app.use('/api-v1/festivals', require('./controllers/api-v1/festivals.js'))
app.use('/api-v1/home', require('./controllers/api-v1/post.js'))

// hey listen
app.listen(PORT, () => {
    rowdyResults.print()
    console.log(`is that port ${PORT} I hear? 🙉`)
})
