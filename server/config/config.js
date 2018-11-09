// choices: production (set in heroku), test (set in packages.json, and development (set here)

var env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {
    var config = require ('./config.json');
    var envConfig = config[env];

    var keys = Object.keys(envConfig);
    keys.forEach((key) => {
	process.env[key] = envConfig[key];
    });
}

