//
// Hash and salt
//
const bcrypt = require ('bcryptjs');
var password = 'password!';

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash (password, salt, (err, hash) => {
	console.log (hash); // this is the hash we will store in the db
    });
});

var hashedPassword = '$2a$10$d/ZBHhWhUJlHWTaUJJoa6.qo1BcP8tz4AYfG4p6/wYLY.6Fx4YOzO';

bcrypt.compare (password, hashedPassword, (err, res) => {
    console.log (res);
} );

