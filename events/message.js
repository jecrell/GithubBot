console.log('Loading message function...');
const bot = require('../bot.js');
const cmds = require('../functions/loadCommands.js').getCmds();
const util = require('../util.js');

bot.on('message', (message) => {

    if (message.author.bot) return;

    // It will listen for messages that will start with `!`
    if (message.content.substring(0, 1) == '!') {
        var cmd = util.getArgument(0, message.content);

        try {
            cmds[cmd].run(message, bot, message.channel.send.bind(message.channel))
          } catch (err) {
            console.log(err);
          }
    }

});