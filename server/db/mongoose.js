var mongoose = require("mongoose");

mongoose.Promise = global.Promise;
/*
mongoose.connect("mongodb://localhost:27017/TodoApp", { useNewUrlParser: true });

MONGODB_URI: mongodb://assana:pix2pash@ds135624.mlab.com:35624/nodeserverclass
*/
var url = process.env.MONGODB_URI || "mongodb://localhost:27017/TodoApp";
mongoose.connect(url, { useNewUrlParser: true });

module.exports = {mongoose};
