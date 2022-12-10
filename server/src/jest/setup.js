dotenv = require('dotenv');

module.exports = async function (globalConfig, projectConfig) {
    dotenv.config({ path: './.env.dev' });
};
