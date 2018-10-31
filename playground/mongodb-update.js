const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect("mongodb://localhost:27017/TodoApp", { useNewUrlParser: true }, (err, client) => {
    if (err) {
	console.log("Unable to connect to database.");
	return;
    }
    console.log ("Connected to Mongo DB");
    const db = client.db('TodoApp');

    db.collection('Todos').findOneAndUpdate({
	_id: new ObjectID ("5bd8e8389e6ee1f284a4ea82")
    }, {
	// Look up mongodb operators...there are many!
	$set: {completed: true}, 
    }, {
	returnOriginal: false
    }).then((result) => {
console.log ("======== Delete Many ========");
	console.log (JSON.stringify (result, undefined, 2));
    });

    db.collection('Users').findOneAndUpdate({
	name: "Elmo"
    }, {
	// Look up mongodb operators...there are many!
	$inc: {age: -7}, 
	$set: {name: "Cookie"}
    }, {
	returnOriginal: false
    }).then((result) => {
console.log ("======== Delete Many ========");
	console.log (JSON.stringify (result, undefined, 2));
    });

    //client.close();
});

