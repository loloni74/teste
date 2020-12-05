const express = require('express')
const cors = require('cors')
const expressLayouts = require('express-ejs-layouts')
const request = require("request")

// Configuration of the app
const app = express() // The server
app.set('view engine', 'ejs') // The ejs view engine
app.set('views', __dirname+"/src/views") // Setting the main folder os the views
app.use(express.static(__dirname + '/public')) // Static acess for the sites
app.use(cors()) // The cross-request treatment
app.use(express.json()) // JSON handling
app.use(expressLayouts) // Express ejs layout


// Error if anything goes wrong
app.get('*', (req,res) => {
    res.send('Error 404');
});

// Port
const port = process.env.PORT || 3000
app.listen(port, ()=>{
    console.log("App Funcionando na porta: ", port)
})

