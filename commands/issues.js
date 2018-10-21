const util = require('../util.js');
const repos = require('../db/repos.json');
const octokit = require('@octokit/rest')();
const createIssue = require('github-create-issue');
const authGithub = require('../authGithub.json');

exports.run = (message, bot, send) => {
    var cmd = util.getArgument(1, message.content);

    //Check through repositories for a match
    for (var i = 0; i < repos.repositories.length; i++) {

        var curRepo = repos.repositories[i];


        if (cmd != curRepo.name) {
            continue;
        }

        //Get repository data from Octokit
        octokit.issues.getForRepo({
            owner: curRepo.user,
            repo: curRepo.repo,
        }).then(({
            data,
            headers,
            status
        }) => {

            var args = message.content.split(' ');
            args.splice(0, 1);
            switch (args.length) {
                case 1:
                    outputIssuesFor(curRepo, message, data);
                    break;
                case 2:
                    outputSingleIssueFor(curRepo, message, data);
                    break;
            }
            if (args.length >= 3)
                handleIssuesAdminFor(curRepo, message);
        });
        break;
    }
}


function outputIssuesFor(curRepo, message, data) {
    var issueCount = 0;
    var result = "";

    //Load issue data
    console.log("Repo found for " + curRepo.name);
    for (var o = 0; o < data.length; o++) {
        if (data[o].state == "open" && !data[o].hasOwnProperty("pull_request")) {
            var newStr = "\n #" + data[o].number + ": `" + data[o].title + "`";
            result = result + newStr;
            issueCount++;
        }
    }
    console.log(result);

    //Add header / footer to results
    result = result.split('\n');
    result.shift();
    result.unshift("*" + issueCount + " issues* found for ***" + curRepo.repo + "***");
    result.push("from: <https://github.com/" + curRepo.user + "/" + curRepo.repo + "/issues>");
    result = result.join('\n');

    //Send the command's results
    message.channel.send(result)
        .then(message => console.log(`Sent message: ${message.content}`))
        .catch(console.error);
}

function outputSingleIssueFor(curRepo, message, data) {
    var result = "";

    var number = util.getArgument(2, message.content);

    //Load issue data
    console.log("Repo found for " + curRepo.name);
    for (var o = 0; o < data.length; o++) {
        if (number == data[o].number) {
            result = "\nIssue #" + data[o].number + ": `" + data[o].title + "` for *" + curRepo.repo + "*\n <" + data[o].html_url + ">";
            break;
        }
    }
    //Send the command's results
    message.channel.send(result)
        .then(message => console.log(`Sent message: ${message.content}`))
        .catch(console.error);
}

function handleIssuesAdminFor(repo, message) {
    var cmd = util.getArgument(2, message.content);

    if (message.member.hasPermission("MANAGE_MESSAGES")) {
        switch (cmd) {
            case "add":
            case "create":
            case "new":
                {
                    console.log('Creating new issue');
                    var messageContent = message.content;
                    var messageArray = messageContent.split(' ');
                    messageArray.splice(0, 3);
                    var slug = repo.user + '/' + repo.repo;
                    console.log(slug);
                    var titleDesc = messageArray.join(' ');
                    let title = titleDesc;
                    let description = "added from discord";
                    if (titleDesc.split('|').length > 1)
                    {
                        title = titleDesc.split('|')[0].trim();
                        description = titleDesc.split('|')[1].trim();
                    }
        
                    createIssue(slug, title, {token: authGithub.token, body: description}, function create(error, issue, info) {
                        if ( info ) {
                            console.error( 'Limit: %d', info.limit );
                            console.error( 'Remaining: %d', info.remaining );
                            console.error( 'Reset: %s', (new Date( info.reset*1000 )).toISOString() );
                        }
                        if ( error ) {
                            throw new Error( error.message );
                        }
                    var newIssue = "Opened new issue: `" + title + "` - `" + description + "` for *" + slug + "*";
                        message.channel.send(newIssue)
                            .then(message => console.log(`Sent message: ${message.content}`))
                            .catch(console.error);
                    })
                    break;
                }
            case "close":
                {
                    break;
                }
        }
    }

}