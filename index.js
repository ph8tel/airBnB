const express = require('express')
const app = express()
const port = process.env.port || 3333
const db = require('./mongo')
const path = require('path')
app.use(express.static(path.join(__dirname, 'public')));


app.get( '/', (req,res) => {
    res.send('hello world')
})

app.listen( port, console.log(`running on port ${port}`) )