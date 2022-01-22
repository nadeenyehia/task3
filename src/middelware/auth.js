// const auth = async (req,res,next)=>{
//     console.log('Auth middelware')
//     // clarify that middelware has finsihed it's job
//     next()
// }

// check token
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const auth = async (req,res,next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        // console.log(token)
        // object --> {_id:'34234234234', iat:3874832} --> iat= issuedat
        const decode = jwt.verify(token,'nodecourse')
        // console.log(decode)

        // 61e442472260abefe4e13f34 , swgo
        const user = await User.findOne({_id:decode._id,tokens:token})
        // console.log(user)
        if(!user){
            // console.log('I am here')
            throw new Error()
        }

    //    x = user
    req.user = user

    // logout
    req.token = token
        // console.log(user)
        next()
    }
    catch(e){
        res.status(401).send({error:'PLease authenticate'})
    }
    // clarify that middelware has finsihed it's job
    
}

module.exports = auth