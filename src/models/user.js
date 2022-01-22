const mongoose=require('mongoose')
const bcrypt = require('bcryptjs')
const validator=require('validator')
const jwt = require('jsonwebtoken')
// const News=mongoose.model('News',{   

   const userSchema=new mongoose.Schema({
    name:{
        type:String,
        trim:require,
        required:true
    },
    email:{
        type:String,
        unique:true,
        trim:true,
        required:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('email is invalid')
            }
        }
    },
    age:{
        type:Number,
        trim:true,
        required:true,
        validate(value){
            if(value<0){
                throw new Error('age must be positive')
            }
        }
    },
    password:{
        type:String,
        minlength:6,
        required:true,
        trim:true
    },
    phoneNumber:{
        required:true,
        type:Number,
        trim:require,
        validate(value){
            if(!validator.isMobilePhone(value [ 'ar-EG' ])){ 
                throw new Error('Phone is invalid');
                
            }
            
        }
    },
    tokens:[
        {
            type:String,
            required:true
        }
    ],
})

userSchema.virtual('news',{
    ref:'News', 
    localField:'_id', 
    foreignField:'owner'
  })

  userSchema.pre('save',async function(next){
    
    const user = this
    if(user.isModified('password'))
   { user.password = await bcrypt.hash(user.password,8)}


})

userSchema.statics.findByCredentials = async (email,password) =>{
    const user = await User.findOne({email})
  
    if(!user){
        throw new Error ('Unable to login..please check email')
    }
    
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error('Unable to login.. please check password')
    }

    return user
}

userSchema.methods.generateToken = async function(){
    
    const user = this
    const token = jwt.sign({_id:user._id.toString()},'nodecourse')
    user.tokens = user.tokens.concat(token)
    
    await user.save()
    
    return token
}


const User = mongoose.model('User',userSchema)
// module.exports=News
module.exports = User