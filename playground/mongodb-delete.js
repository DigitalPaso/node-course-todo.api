const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect("mongodb://localhost:27017/TodoApp", { useNewUrlParser: true }, (err, client) => {
    if (err) {
	console.log("Unable to connect to database.");
	return;
    }
    console.log ("Connected to Mongo DB");
    const db = client.db('TodoApp');

/*
    db.collection('Todos').deleteMany({
	text: "Something to do"
    }).then((result) => {
console.log ("======== Delete Many ========");

	console.log (JSON.stringify (result, undefined, 2));
	
    }, (err) => {
	console.log ("Unable to delete from the database.", err);
    });

    db.collection('Todos').deleteOne({
	text: "Something to do"
    }).then((result) => {
console.log ("======== Delete One ========");

	console.log (JSON.stringify (result, undefined, 2));
	
    }, (err) => {
	console.log ("Unable to delete from the database.", err);
    });

    db.collection('Todos').findOneAndDelete({
	text: "Something to do"
    }).then((result) => {
console.log ("======== Fine One And Delete ========");

	console.log (JSON.stringify (result, undefined, 2));
	
    }, (err) => {
	console.log ("Unable to delete from the database.", err);
    });
*/
    db.collection('Users').deleteMany({
	name: "assana"
    }).then((result) => {
console.log ("======== Delete Many ========");

	console.log (JSON.stringify (result, undefined, 2));
	
    }, (err) => {
	console.log ("Unable to delete from the database.", err);
    });

    db.collection('Users').findOneAndDelete({
	_id: new ObjectID("5bd8e5273c41570ce39e2c8b")
    }).then((result) => {
console.log ("======== Delete Many ========");

	console.log (JSON.stringify (result, undefined, 2));
	
    }, (err) => {
	console.log ("Unable to delete from the database.", err);
    });

    //client.close();
});

