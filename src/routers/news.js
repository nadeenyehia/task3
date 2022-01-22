const express = require('express')
const News = require('../models/news')
const router = new express.Router()
const auth = require('../middelware/auth')

router.post('/news',auth,async(req,res)=>{
    try{
        
        const news = new News({...req.body,owner:req.user._id})
        await news.save()
        res.status(200).send(news)
    }
    catch(e){
        res.status(400).send(e.message)
    }
})



router.get('/news',auth,async(req,res)=>{
    try{
        await req.user.populate('news')
        res.send(req.user.news)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})



router.get('/news/:id',auth,async(req,res)=>{
    try{
        const _id = req.params.id
 
        const news = await Task.findOne({_id,owner:req.user._id})
        console.log(news)
        if(!news){
           return res.status(404).send('No news')
        }
        res.send(news)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})

// patch 

router.patch('/news/:_id',auth,async(req,res)=>{
    try{
        const id = req.params._id
        const news = await News.findOneAndUpdate({_id:id,owner:req.user._id},req.body,{
            new:true,
            runValidators:true
        })
        if(!news){
          return res.send('No news')
        }
        res.send(news)
    }
    catch(e){
        res.send(e.message)
    }
})

router.delete('/news/:id',auth,async(req,res)=>{
    try{
        const _id  = req.params.id
        const news = await News.findOneAndDelete({_id,owner:req.user._id})
        if(!news){
            return res.status(404).send('No news')
        }
        res.send(news)
    }
    catch(e){
        res.send(e.message)
    }
})



module.exports = router