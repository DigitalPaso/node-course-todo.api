var mongoose = require('mongoose');

var Todo = mongoose.model("Todo", {
    text: {
	type: String,
	required: true,
	minlength: 1,
	trim: true		// remove leading or trailing white space
    },
    completed: {
	type: Boolean,
	default: false
    },
    completedAt: {
	type: Number,
	default: null
    },
    _creator: {
	type: mongoose.Schema.Types.ObjectId,
	required: true
    }

});

/*
var newTodo = new Todo ({
    text: "    Another todo    ",
    completed: true,
    completedAt: 2938
    });

newTodo.save ().then ((doc) => {
    console.log (JSON.stringify (doc, undefined, 2));
}, (e) => {
    console.log ("Unable to save todo");
});
*/

module.exports = {Todo};
