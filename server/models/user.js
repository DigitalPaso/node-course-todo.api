var mongoose = require('mongoose');

var User = mongoose.model("User", {
    email: {
	type: String,
	required: true,
	minlength: 1,
	trim: true		// remove leading or trailing white space
    },
});

/*
var newUser = new User ({
    email: "assana@digitalpaso.com"
    });


newUser.save().then((user) => {
    console.log (JSON.stringify (user, undefined, 2));
}, (e) => {
    console.log ("Couldn't save this user.");
});
*/

module.exports = {User};
