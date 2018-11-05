var express 	= require ('express');
var bodyParser 	= require ('body-parser');
var {ObjectID} 	= require ('mongodb');

var {mongoose} 	= require("./db/mongoose.js");
var {Todo} 	= require ('./models/todo.js');
var {User} 	= require ('./models/user.js');


//var url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp";
//mongoose.connect(url);
//mongodb://assana:pix2pash@ds135624.mlab.com:35624/nodeserverclass

var app = express();
const port = porcess.env.PORT || 3000;

app.use(bodyParser.json());

app.post ('/todos',  (req, res) => {
    var todo = Todo({
	text: req.body.text
    });
    todo.save().then ((doc) => {
	res.send(doc)
    }, (e) => {
	res.status(400).send(e);
    });
    console.log (todo);
});

app.get ('/todos', (req, res) => {
    Todo.find().then (
	function(todos) {
	    res.send({todos});
	}
       ,function(e) {
	    res.status(400).send(e);
        }
    );
});

app.get ('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id))  {
	console.log ("Id not valid");
	return res.status(404).send();
    }
    Todo.findById(id).then ((todo) => {
	if (!todo) {
	    return res.status(404).send();
	}
	res.status(200).send ({todo});
    }).catch ((e) => {
	res.status(400).send();
    });
});

app.listen(port, () => {
    console.log (`Server started on port ${port}`);
});

module.exports = {app};
