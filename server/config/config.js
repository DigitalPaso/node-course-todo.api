// choices: production (set in heroku), test (set in packages.json, and development (set here)

var env = process.env.NODE_ENV || 'development';
console.log ("env:", env);

if (env === 'development' || env === 'test') {
    var config = require ('./config.json');
    var envConfig = config[env];
    console.log (envConfig);

    var keys = Object.keys(envConfig);
    if (keys)
	console.log (keys);
    keys.forEach((key) => {
	process.env[key] = envConfig[key];
    });
}

