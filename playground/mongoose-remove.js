const {ObjectID} = require ('mongodb');
const {mongoose} = require ('../server/db/mongoose.js');
const {Todo} = require ('../server/models/todo.js');
const {User} = require ('../server/models/user.js');

var id = "5be1e37b777331bc65d4ba6f";
if (!ObjectID.isValid(id))  {
    return console.log ("Id not valid");
}

/*
Todo.remove({}).then ((todos) => {
    console.log (todos);
});


Todo.findOneAndRemove({
    _id: id
}).then ((todo) => {
    console.log (todo);
});
*/

Todo.findByIdAndRemove(id).then ((todo) => {
    if (!todo) 
	return console.log ("id not found");
    console.log (todo);
}).catch((e) => console.log(e));

/*
Todo.findOneAndRemove(id).then ((todo) => {
    if (!todo) 
	return console.log ("id not found");
    console.log (todo);
}).catch((e) => console.log(e));

var userId = "5bdb915b0369a8057eb666a9";

if (!ObjectID.isValid(userId))  {
    return console.log ("userId not valid");
}

User.findById (userId).then ((user) => {
    if (!user)
	return console.log('User not found');
    console.log (JSON.stringify (user, undefined, 2));}, (e) => {
    console.log (e);
});
*/
