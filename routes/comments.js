const express = require('express')
const Comment = require('../models/comments')
const router = new express.Router()
const auth = require('../middlewear/auth')


router.post('/add_comment', auth , async (req,res) =>{
    const name = req.user.name
    const comment_text = req.body.comment_text
    const post_id = req.body.post_id
    
    
    const comment = new Comment({
        name,
        comment_text,
        post_id
    })
    try {
        await comment.save()
        res.send(comment)
    } catch (error) {
        res.send(error)
    }
})

router.get('/comments/:id' ,async (req,res)=>{
    
    
    try {
        const comments = await Comment.find({
            post_id: req.params.id
        })

        res.send(comments)
    } catch (error) {
        res.send(error)
    }
})


module.exports = router