const express = require('express')
const cors = require('cors')
const expressLayouts = require('express-ejs-layouts')



// Configuration of the app
const app = express() // The server
app.set('view engine', 'ejs') // The ejs view engine
app.set('views', __dirname+"/src/views") // Setting the main folder os the views
app.use(express.static(__dirname + '/public'))

app.use(cors()) // The cross-request treatment
app.use(express.json()) // JSON handling
app.use(expressLayouts) // Express ejs layout


// Routing
const routes = require('./routes.js')
const apiRoutes = require('./src/api/routes.js')
app.use('/', routes)
app.use('/api', apiRoutes)

app.get('*', function(req, res){
    res.send('Error 404');
});


// Port
const port = process.env.PORT || 8080
app.listen(port, ()=>{
    console.log("App listening on port: ", port)
})

