//
// destruture example
//
/*
var user = {name: 'assana', age: 50};
var {name} = user;
console.log (name);
*/


// Old way:
//var MongoClient = require('mongodb').MongoClient;

// destructure way:
const {MongoClient, ObjectID} = require('mongodb');

// For example...
var obj = new ObjectID();
console.log (obj);

MongoClient.connect("mongodb://localhost:27017/TodoApp", { useNewUrlParser: true }, (err, client) => {
    if (err) {
	console.log("Unable to connect to database.");
	return;
    }
    console.log ("Connected to Mongo DB");
    const db = client.db('TodoApp');

/*
    db.collection ("Todos").insertOne({
	text:	'Something to do',
	completed: false
    }, function(err, result) {
	if (err)
	    return console.log ("Unable to insert a record.", err);
	console.log (JSON.stringify(result.ops, undefined, 2));
    });
*/

    db.collection("Users").insertOne({
	name: 'assana',
	age: 50,
	location: 'Sunnyvale'
    }, function (err, result) {
	if (err)
	    return console.log ("Unable to inser a user record.", err);
	console.log (result.ops[0]._id.getTimestamp(), JSON.stringify(result.ops, undefined, 2));
    });

    client.close();
});

