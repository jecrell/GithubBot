const Bot = require('./models/Bot')

const config = require('./auth')

Bot().then(bot => {
    module.exports = bot;
    require('@octokit/rest')();
    require('./events/message');
    require('./functions/loadCommands.js').load();
    bot.login(config.token);
}).catch(err => console.log(err));