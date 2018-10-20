const octokit = require('@octokit/rest')({
    debug:true
})
const Discord = require('discord.io');
const logger = require('winston');
const fs = require('fs');
const auth = require('./auth.json');
const repos = require('./repos.json');

function issueCommandHandler(args)
{
    var cmd = args[0];
    var repoName = "";
    var repoUser = "";
    var result = "";
    for (var i = 0; i < repos.repositories.length; i++)
    {
        if (cmd == repos.repositories[i].name)
        {
            octokit.issues.getForRepo({
                owner: repos.user,
                repo: repos.repo,
              })
            break;
        }
    }
    return result;
}

function modOrderHandler()
{
    var options = {encoding: 'utf-8', flag:'r'};
    var buffer = fs.readFileSync('./docs/modorder.txt')
    return buffer;
}

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
    if (repos.repositories.length > 0)
        logger.info('Repositories loaded: ' + repos.repositories.length);
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (user != bot.username)
    {
        if (message.substring(0, 1) == '!') {
            var args = message.substring(1).split(' ');
            var cmd = args[0];
           
            args = args.splice(1);
            switch(cmd) {
                // !ping
                case 'ping':
                    bot.sendMessage({
                        to: channelID,
                        message: 'Pong!'
                    });
                    break;
                case 'pong':
                    bot.sendMessage({
                        to: channelID,
                        message: 'Ping!'
                    });
                    break;
                case 'issues':
                    bot.sendMessage({
                        to: channelID,
                        message: issueCommandHandler(args)
                    })
                    break;
                case 'modorder':
                    bot.sendMessage({
                        to: channelID,
                        message: modOrderHandler()
                    })
                    break;
                break;
                // Just add any case commands if you want to..
             }
         }
    }
});