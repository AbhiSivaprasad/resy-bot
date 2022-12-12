dotenv = require('dotenv');

module.exports = function (globalConfig, projectConfig) {
    dotenv.config({ path: './.env.dev' });
};
