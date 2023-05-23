const Post = require("../../models/Post")
const express = require('express')
const router = express.Router()
const axios = require('axios')
const authLockedRoute = require("./authLockedRoute")

router.get('/', authLockedRoute, async (req, res) => {
    try {
      const posts = await Post.find().populate('userId', 'name')
  
      res.json({ posts })
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Failed to fetch posts' })
    }

})

router.post('/', authLockedRoute, async (req, res) => {
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
  
  router.put("/:postId", authLockedRoute, async (req,res) => {
    try {
        const { postId } = req.params
        const { content } = req.body
        console.log(postId, content)
        const post = await Post.findById(postId)
        
        if (!post) {
          return res.status(404).json({ error: 'Post not found' })
        }
        if(post.userId.toString() !== res.locals.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized' })
          }
          console.log(res.locals)
          console.log(req.body)
        post.content = content
        await post.save()
      
          res.json({ post })
        } catch (error) {
          console.log(error)
          res.status(500).json({ error: 'Failed to edit post' });
        }
    })

    router.delete('/:postId', authLockedRoute,  async (req, res) => {
        try {
          const { postId } = req.params
          console.log('postId:', postId)
          const post = await Post.findById(postId)
          console.log('post:', post)

          if (!post) {
            return res.status(404).json({ error: 'Post not found' })
          }
          console.log('post.userId:', post.userId)
          console.log(res.locals)

          if (post.userId.toString() !== res.locals.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized' })
          }
      
          await post.deleteOne()
      
          res.json({ message: 'Post deleted successfully' })
        } catch (error) {
          console.log(error)
          res.status(500).json({ error: 'Failed to delete post' })
        }
      })
      
module.exports = router
