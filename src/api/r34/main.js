class requestFromApi {
  constructor() {
    this.r34Api = require("./r34.js");
    this.bestApi = require("./best.js");
  }
  async r34(request) {
    let response = await this.r34Api(request);
    return response;
  }
  async best(request) {
    let response = await this.bestApi(request);
    return response;
  }
}

module.exports = new requestFromApi();
