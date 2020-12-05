const express = require('express')
const routes = express.Router()
const autocomplete = require('./autocomplete.js')


routes.get('/autocomplete', async (req,res)=>{
    let autocomp = await autocomplete(req)
    res.send(autocomp)
})

module.exports = routes