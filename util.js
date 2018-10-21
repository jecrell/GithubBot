const bot = require('./bot.js');

module.exports = {
    getArgument : getCommandArgument
};

function getCommandArgument(atIndex, fromLine){
    //Exclude the ! mark and return the string
    var args = fromLine.substring(1).split(' ');
    return args[atIndex];
}