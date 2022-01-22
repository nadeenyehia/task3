

const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const News = require('./models/news')
const User = require('./models/user')

require('./db/mongoose')

app.use(express.json())
const userRouter = require('./routers/user')
const newsRouter = require('./routers/news')

app.use(userRouter)
app.use(newsRouter)


app.listen(port,()=>{console.log('Listening on port 3000')})




