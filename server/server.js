var express 	= require ('express');
var bodyParser 	= require ('body-parser');
var {ObjectID} 	= require ('mongodb');

var {mongoose} 	= require("./db/mongoose.js");
var {Todo} 	= require ('./models/todo.js');
var {User} 	= require ('./models/user.js');


var app = express();
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

app.listen(3000, () => {
    console.log ("Server started on port 3000");
});

module.exports = {app};
