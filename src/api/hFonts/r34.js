const axios = require("axios");
const parser = require("xml2json");
const model = require("../../models/postsModel.js");

module.exports = async (request) => {
  let base_url = "https://rule34.xxx/index.php?page=dapi&s=post&q=index";

  let pid = request.pid || "";
  let limit = request.limit || 20;
  let tags = request.tags || "";

  pid = `&pid=${request.pid}`;
  limit = `&limit=${limit}`;
  tags = `&tags=${tags}`;

  let html = base_url + pid + limit + tags;
  let apiData = await axios.get(html);

  apiData = JSON.parse(parser.toJson(apiData.data)).posts.post;
  try{
    apiData = await model.r34Creator(apiData)
  } catch(error){
    console.log(error)
  }

  console.log("Running search: " + html);

  return apiData;
};
