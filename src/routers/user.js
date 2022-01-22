const express = require('express')

const router = express.Router()

const User = require('../models/user')

const auth = require('../middelware/auth')

router.post('/signup', async (req, res) => {
    try{
        const user = new User(req.body) 
        await user.save()
        const token = await user.generateToken()
        res.status(200).send({user,token})
    }
    catch(e){
        res.status(400).send(e)
    }

})


router.post('/login',async (req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateToken()
        res.status(200).send({user,token})
    }
    catch(e){
        res.status(400).send(e.message)
    }
})


router.get('/profile',auth,async(req,res)=>{
    res.send(req.user)
})

router.get('/users', auth,(req, res) => {
    User.find({}).then((users) => {
        res.status(200).send(users)
    }).catch((e) => {
        res.status(500).send(e)
    })
})




router.patch('/users/:id',auth,async (req,res)=>{
    const _id = req.params.id
 
    const updates = Object.keys(req.body)
   
   try{
      
       const user = await User.findById(_id)
       if(!user){
        return res.status(404).send('Unable to find user')
    }
       console.log(user)
     
       updates.forEach((update)=> (user[update] = req.body[update]))
       await user.save()
    
       
       res.status(200).send(user)
   }catch(e){
       res.status(400).send(e.message)
   }
})
 
router.delete('/users/:id',auth,async(req,res)=>{
    const _id = req.params.id
    try{
        const user = await User.findByIdAndDelete(_id)
        if(!user){
            return res.status(404).send('No user is found')
        }
        res.send(user)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})
 

router.delete('/logout',auth,async(req,res)=>{
    try{
     
        req.user.tokens = req.user.tokens.filter((el)=>{
        
            return el !== req.token
        })
        await req.user.save()
        res.send('Logout Successfully')
    }
    catch(e){
       res.status(500).send(e.message)
    }
})


router.delete('/logoutall',auth,async(req,res)=>{
   try{
        req.user.tokens = []
    await req.user.save()
    res.send('Logout all was done successfully')
   }
   catch(e){
       res.send(e)
   }
   
})













module.exports = router
