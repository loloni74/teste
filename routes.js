const express = require("express");
const routes = express.Router();
const https = require("https");

const axios = require("axios");
const parser = require("xml2json");

const api = require("./src/api/hFonts/main.js");

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
routes.get("/home", (req, res) => {
  res.render("home");
});
routes.get("/tags", (req, res) => {
  res.render("tags");
});

routes.get("/best", async (req, res) => {
  let apiData = await api.best(req.query);
  res.render("posts", {
    query: JSON.stringify(req.query),
    data: JSON.stringify(apiData),
  });
});

routes.get("/image", function (req, res) {
  let url = req.query.url;
  if (!url || req.query.url === "") {
    res.sendStatus(404);
  }
  const request = https.get(url, function (response) {
    res.setHeader("Content-Type", response.headers["content-type"]);
    response.pipe(res);
  });

  request.on("error", function (e) {
    console.error(e);
  });
});

module.exports = routes;
