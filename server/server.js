// work around to get ES6 imports up and running
require = require("esm")(module);
module.exports = require("./server_app.js");