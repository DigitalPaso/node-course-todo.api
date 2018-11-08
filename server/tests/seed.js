const {ObjectID} = require ('mongodb');
const {Todo} = require ('../models/todo.js');
const {User} = require ('../models/user.js');
const jwt = require ('jsonwebtoken');

var todos = [
    {_id: new ObjectID(),
    text: "First test todo"},
    {_id: new ObjectID(),
    text: "Second test todo",
    completed: "true",
    completedAt: 239474864}
];

const userOneID = new ObjectID();
const userTwoID = new ObjectID();
var users = [
    // user with valid auth data
    {
    _id : userOneID,
    email: 'elom@foopity.com',
    password: 'userOnePassword!',
    tokens: [{
	access: 'auth',
	token: jwt.sign({_id: userOneID, access:'auth'},
		'something').toString()
    }]

    },
    // user with invalid auth data
    {
    _id : userTwoID,
    email: 'cookie@foopity.com',
    password: 'userTwoPassword!',
    // note: no tokens so we can get errors
    }
];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        Todo.insertMany (todos);
    }).then(() => done());
};

const populateUsers = (done) => {
    User.remove({}).then(() => {
	var userOne = new User(users[0]).save();
	var userTwo = new User(users[1]).save();
	return Promise.all([userOne, userTwo]);
    }).then(() => done());
};


module.exports = {
    todos, 
    populateTodos,
    users, 
    populateUsers
};
