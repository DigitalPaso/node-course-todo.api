		  require ('./config/config.js');
var express 	= require ('express');
var bodyParser 	= require ('body-parser');
var {ObjectID} 	= require ('mongodb');
const _ 	= require ('lodash');

var {mongoose} 	= require("./db/mongoose.js");
var {Todo} 	= require ('./models/todo.js');
var {User} 	= require ('./models/user.js');
var {authenticate} = require ('./middleware/authenticate.js');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post ('/todos', authenticate, (req, res) => {
    var todo = Todo({
	text: req.body.text,
	_creator: req.user._id
    });
    todo.save().then ((doc) => {
	res.send(doc)
    }, (e) => {
	res.status(400).send(e);
    });
    console.log (todo);
});

app.get ('/todos', authenticate, (req, res) => {
    console.log ("Fetching todos for user", req.user._id);
    Todo.find({
	_creator: req.user._id
    }).then (
	function(todos) {
	    res.send({todos});
	}
       ,function(e) {
	    res.status(400).send(e);
        }
    );
});

app.get ('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id))  {
	console.log ("Id not valid");
	return res.status(404).send();
    }
    Todo.findOne({
	_id: id,
	_creator: req.user._id
    }).then ((todo) => {
	if (!todo) {
	    return res.status(404).send();
	}
	res.status(200).send ({todo});
    }).catch ((e) => {
	res.status(400).send();
    });
});

app.delete('/todos/:id', authenticate, async (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id))  {
	console.log ("Id not valid");
	return res.status(404).send();
    }

    try {
	const todo = await Todo.findOneAndRemove({
	     _id: id,
	     _creator: req.user._id});
	if (!todo) {
	    return res.status(404).send();
	}
	res.status(200).send ({todo});
    } catch (e) {
	res.status(400).send();
    }
});

app.patch('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id))  {
	console.log ("Id not valid");
	return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
	body.completedAt = new Date().getTime();
    } else {
	body.completed = false;
	body.completedAt = null;
    }

    Todo.findOneAndUpdate({
	_id: id,
	_creator: req.user._id}, 
	{$set: body}, {new: true}).then ((todo) => {
	if (!todo) {
	    console.log ("Can't find/update this item");
	    return res.status(404).send();
	}
	console.log ("Todo updated!");
	res.status(200).send ({todo});
    }).catch ((e) => {
	res.status(400).send();
    });
});

//
// **********
// User stuff
// **********
//
app.post ('/users', async (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);
    const user = new User(body);
    try {
	await user.save();
	var token = await user.generateAuthToken();
	res.header("x-auth", token).send(user);
    } catch(e) {
	res.status(400).send(e);
    }
});

app.get ('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post ('/users/login', async (req, res) => {
    try {
	const body = _.pick(req.body, ['email', 'password']);
	const user = await User.findByCredentials (body);
	const token = await user.generateAuthToken();
	res.header("x-auth", token).send(user);
    } catch (e) {
        res.status(400).send(e);
    }
});

app.delete ('/users/me/token', authenticate, async (req, res) => {
    try {
	await req.user.removeToken(req.token);
	res.status(200).send();
    } catch (e) {
	res.status(400).send();
    }
});

app.listen(port, () => {
    console.log (`Server started on port ${port}`);
});

module.exports = {app};
