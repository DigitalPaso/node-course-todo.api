const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect("mongodb://localhost:27017/TodoApp", { useNewUrlParser: true }, (err, client) => {
    if (err) {
	console.log("Unable to connect to database.");
	return;
    }
    console.log ("Connected to Mongo DB");
    const db = client.db('TodoApp');

    db.collection('Todos').find().toArray().then((docs) => {
console.log ("======== All Items ========");
	console.log (JSON.stringify (docs, undefined, 2));
	
    }, (err) => {
	console.log ("Unable to read from the database.", err);
    });

    db.collection('Todos').find({completed: false}).toArray().then((docs) => {
console.log ("======== Done Items ========");
	console.log (JSON.stringify (docs, undefined, 2));
	
    }, (err) => {
	console.log ("Unable to read from the database.", err);
    });

    db.collection('Todos').find({
	_id: new ObjectID('5bd8e5273c41570ce39e2c8a')}).toArray().then((docs) => {
console.log ("======== By ID ========");
	console.log (JSON.stringify (docs, undefined, 2));
	
    }, (err) => {
	console.log ("Unable to read from the database.", err);
    });

    db.collection('Todos').find().count().then((count) => {
console.log ("======== Count ========");
        console.log (`Todos count: ${count}`);
    }, (err) => {
        console.log ("Unable to read from the database.", err);
    });

    db.collection('Users').find({name: "assana"}).count().then((count) => {
console.log ("======== All Assanas ========");
        console.log (`Assana count: ${count}`);
    }, (err) => {
        console.log ("Unable to read from the database.", err);
    });
    //client.close();
});

