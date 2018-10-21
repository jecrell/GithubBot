var fs = require('fs');

/**
 * Prints out Trisscar's mod order list.
 * @param {object} fs the fs node module for reading files 
 */
exports.run = (message, bot, send) => {
    fs.readFile('./docs/modorder.txt', 'utf8', function read(err, data)
    {
        if (err){
            console.log(err);
        }
        console.log(data);
        send(data);
    });
};
exports.conf = {
    userPerm: [],
    botPerm: ["SEND_MESSAGES"],
    coolDown: 0,
    dm: true,
    category: "Other",
    help: "Prints out Trisscar's mod order list.",
    args: ""
};