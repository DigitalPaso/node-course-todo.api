const mongoose 	= require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const _ = require('lodash');

var UserSchema = new mongoose.Schema({
    email: {
	type: String,
	required: true,
	minlength: 1,
	trim: true,		// remove leading or trailing white space
	unique: true,
	validate: {
	    validator: validator.isEmail,
	    message: '{VALUE} is not a valid email'
	}
    },
    password: {
	type: String,
	require: true,
	minlength: 6
    },
    tokens: [{
	access: {
	    type: String,
	    require: true,
	},
	token: {
	    type: String,
	    require: true,
	}
    }]
});

UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();
    
    return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({
	_id:	user._id.toHexString(), 
	access: access}, "secretvalue").toString();;

    user.tokens = user.tokens.concat([{access, token}]);
    return token;
    /*
    return user.save().then(() => {
	return (token);
    });
    */
}

var User = mongoose.model("User", UserSchema);

module.exports = {User};

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

