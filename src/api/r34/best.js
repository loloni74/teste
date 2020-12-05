const axios = require("axios");
const parser = require("xml2json");
const model = require("../../models/postsModel.js");

module.exports = async (request) => {
  let base_url = "https://rule34.xxx/index.php?page=dapi&s=post&q=index";
  let limit = request.limit || 10;
  let tags = request.tags || "";
  tags = tags.split(" ").join("+");
  let quality = request.quality || 10;
  if (limit == "" || limit == 0) {
    limit = 10;
  }
  if (quality == "" || quality == 0) {
    quality = 10;
  }
  tags = `&tags=${tags}`;
  console.clear()
  let result = [];
  for (x = 0; x < 20; x++) {
    pid = `&pid=${x}`;
    let html = base_url + tags + pid;
    let apiData = await axios.get(html);
    apiData = JSON.parse(parser.toJson(apiData.data)).posts.post;
    apiData = await model.r34Creator(apiData);

    apiData.every((element) => {
      if (parseInt(element.score) > parseInt(quality)) {
        result.push(element);
        if (result.length >= limit) {
          x = 999;
          return false;
        }
      }
      return true;
    });
    console.log(result.length)
    console.log("Running search: " + html);
  }

  return result;
};
