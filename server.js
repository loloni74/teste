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

// Search engine config
app.use('/robots.txt', (req,res) => {
    res.type('text/plain')
    res.send("User-agent: *\nDisallow: /");
});


// Routing
const r34Routes = require('./routes/r34Routes.js')
const r34ApiRoutes = require('./src/api/r34/uses/routes.js')

// 
app.all('/', (req,res) =>{
    res.render("r34/home");
})

// r34
app.use('/r34', r34Routes)
app.use('/r34Api', r34ApiRoutes)

// Image Router
app.all("/image", async (req, res) => {
    let url = req.query.url;
    if (!url || req.query.url === "") {
      res.sendStatus(404);
    }
    var response = await request(url);
    response.pipe(res);
});

// Error if anything goes wrong
app.get('*', (req,res) => {
    res.send('Error 404');
});

// Port
const port = process.env.PORT || 3000
console.log("App Funcionando na porta: ", port)

app.listen(port)

