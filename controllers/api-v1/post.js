const Post = require("../../models/Post")
const express = require('express')
const router = express.Router()
const axios = require('axios')
const authLockedRoute = require("./authLockedRoute")
const Comment = require("../../models/Comment")

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

    router.get('/:postId/comments', authLockedRoute, async (req, res) => {
        try {
          const { postId } = req.params
          const post = await Post.findById(postId)
          if (!post) {
            return res.status(404).json({ error: 'Post not found' })
          }
          // declare empty [], to store comment objects
          const comments = []
          // loop over post.comments in order to isolate one comment id
          for( const commentId of post.comments ){
            // use comment id to query db
            const comment = await Comment.findById(commentId)
            // save db query to object, then push object into empty []
            comments.push(comment)
            console.log(commentId)
          }
          // overwrite value of post.comments to be [] variable
          post.comments = comments
        //   const comment = await Comment.find({ postId })
          res.json({ post })
        //   res.json({  comments })
          console.log(post)
        } catch (error) {
          console.log(error)
          res.status(500).json({ error: 'Internal server error' })
        }
      })

    router.post('/:postId/comments', authLockedRoute, async (req, res) => {
        try {
          const { postId } = req.params
          const { content } = req.body
          console.log( typeof req.body)
          const post = await Post.findById(postId)
      
          if (!post) {
            return res.status(404).json({ error: 'Post not found' })
          }
      
          const comment = new Comment({
            content,
            userId: res.locals.user.id
          })
          console.log(comment)
          await comment.save()
         post.comments.push(comment)
          await post.save()
          res.status(201).json({ comment })
        } catch (error) {
          console.log(error);
          res.status(500).json({ error: 'Failed to create comment' })
        }
      })
      
      // Update a comment
      router.put('/:postId/comments/:commentId', authLockedRoute, async (req, res) => {
        try {
          const { postId, commentId } = req.params
          const { content } = req.body
      
          const post = await Post.findById(postId)
      
          if (!post) {
            return res.status(404).json({ error: 'Post not found' })
          }
      
          const comment = post.comments.id(commentId)
      
          if (!comment) {
            return res.status(404).json({ error: 'Comment not found' })
          }
      
          comment.content = content
          await post.save()
      
          res.json({ comment })
        } catch (error) {
          console.log(error)
          res.status(500).json({ error: 'Failed to update comment' })
        }
      })
      
      // Delete a comment
      router.delete('/:postId/comments/:commentId', authLockedRoute, async (req, res) => {
        try {
          const { postId, commentId } = req.params
      
          const post = await Post.findById(postId)
      
          if (!post) {
            return res.status(404).json({ error: 'Post not found' })
          }
      
          const comment = post.comments.id(commentId)
      
          if (!comment) {
            return res.status(404).json({ error: 'Comment not found' })
          }
      
          comment.remove()
          await post.save()
      
          res.json({ message: 'Comment deleted successfully' })
        } catch (error) {
          console.log(error)
          res.status(500).json({ error: 'Failed to delete comment' })
        }
      })
      
module.exports = router
