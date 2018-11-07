//
// Hash and salt
//
const {SHA256} = require ('crypto-js');

var message = 'I am user number 20394';
var hash = SHA256(message).toString();

console.log (`Message: ${message}`);
console.log (`Hash: ${hash}`);

var data = {
    id: 4
};

var token = {
    data: data,
    hash: SHA256(JSON.stringify (data)+'somesecret').toString()
};

// 
// Break the data
//
token.data.id = 5;
token.hash = SHA256(JSON.stringify (token.data)).toString()

var resultHash = SHA256(JSON.stringify(token.data)+'somesecret').toString();

if (resultHash === token.hash) {
    console.log ('Data was not changed!');
} else {
    console.log ('Data was change. Do not trust.');
}




