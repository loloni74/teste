const express = require("express");
const https = require("https");
const api = require("./src/api/hFonts/main.js");


const routes = express.Router();
// Default route
routes.get("/", (req, res) => {
  res.redirect("/home");
});

// Posts route
routes.get("/posts", async (req, res) => {
  let apiData = await api.r34(req.query);
  res.render("posts", {
    query: JSON.stringify(req.query),
    data: JSON.stringify(apiData),
  });
});

// Home Route
routes.get("/home", (req, res) => {
  res.render("home");
});

// Best Route
routes.get("/best", async (req, res) => {
  let apiData = await api.best(req.query);
  res.render("posts", {
    query: JSON.stringify(req.query),
    data: JSON.stringify(apiData),
  });
})

// Image Router
routes.get("/image", (req, res)=> {
  let url = req.query.url;
  if (!url || req.query.url === "") {
    res.sendStatus(404);
  }
  const request = https.get(url, (response) => {
    res.setHeader("Content-Type", response.headers["content-type"]);
    response.pipe(res);
  });

  request.on("error", (e) => {
    console.error(e);
  });
});

// Test Router
routes.all("/test", (req,res) =>{
  const htmlBuilder = require('./public/generalUse/htmlBuilder')
  let result = htmlBuilder.build('rule34.xxx/',htmlBuilder.objToList({pid:1,query:"the_last_of_us minecraft"}))
  res.send(result)
})

module.exports = routes;
