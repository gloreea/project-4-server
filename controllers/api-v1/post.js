const Post = require("../../models/Post")
const express = require('express')
const router = express.Router()
const axios = require('axios')

router.get('/', async (req, res) => {
    try {
      const posts = await Post.find().populate('userId', 'name')
  
      res.json({ posts })
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Failed to fetch posts' })
    }

})

router.post('/', async (req, res) => {
    console.log('Received a create post request')
    try {
      const { userId, content, festival } = req.body
  
      const post = new Post({
        userId,
        content,
        festival,
        comments: [],
        likes: [],
      })
  
      await post.save()
  
      res.json({ post })
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Failed to create post' })
    }
  })
  module.exports = router