const express = require("express");
const api = require("../src/api/r34/main.js");

const routes = express.Router();

// Default route
routes.get("/", (req, res) => {
  res.redirect("/posts");
});

// Posts route
routes.get("/posts", async (req, res) => {
  let apiData = await api.r34(req.query);
  res.render("r34/posts", {
    query: JSON.stringify(req.query),
    data: JSON.stringify(apiData),
  });
});

// Best Route
routes.get("/best", async (req, res) => {
  let apiData = await api.best(req.query);
  res.render("posts", {
    query: JSON.stringify(req.query),
    data: JSON.stringify(apiData),
  });
});



// Test Router
routes.all("/test", (req, res) => {
  const htmlBuilder = require("./public/generalUse/htmlBuilder");
  let result = htmlBuilder.build(
    "rule34.xxx/",
    htmlBuilder.objToList({ pid: 1, query: "the_last_of_us minecraft" })
  );
  res.send(result);
});

routes.all("/next", (req, res) => {
  res.sendFile(__dirname + "/next-Icon.png");
});

module.exports = routes;
