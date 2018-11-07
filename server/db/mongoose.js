var mongoose = require("mongoose");

mongoose.Promise = global.Promise;

/*
horoku: MONGODB_URI: mongodb://assana:pix2pash@ds135624.mlab.com:35624/nodeserverclass
var url = process.env.MONGODB_URI || "mongodb://localhost:27017/TodoApp";
*/
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

module.exports = {mongoose};
