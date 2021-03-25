const axios = require("axios");
const parser = require("xml2json");
const model = require("../../models/postsModel.js");

module.exports = async (request) => {
  let base_url = "https://rule34.xxx/index.php?page=dapi&s=post&q=index";
  let pid = request.pid || "10";
  let limit = request.limit || 50;
  let tags = request.tags || "";
  let quality = request.quality

  pid = `&pid=${request.pid}`;
  limit = `&limit=${limit}`;
  tags = `&tags=${tags}`+` score:>${quality}`;


  let html = base_url + pid + limit + tags;
  console.log("Running search: " + html);
  let apiData = await axios.get(html);

  apiData = JSON.parse(parser.toJson(apiData.data)).posts.post;
  try{
    apiData = await model.r34Creator(apiData)
  } catch(error){
    console.log(error)
  }
  return apiData;
};
