console.log("Bot startup...")
let start = (new Date()).getTime()

const Discord = require('discord.js')

const Bot = () => {

    return new Promise((resolve, reject) => {

            let bot = new Discord.Client({
                disabledEvents: ['TYPING_START'],
                //messageCacheMaxSize: 50,
                //messageCacheLifetime: 300,
                //messageSweepInterval: 300
            })

            //bot.config = new GuildConfig(data)
            //bot.profile = new ProfileConfig(data)
            //bot.system = new SystemConfig(data)
            bot.embed = Discord.RichEmbed;

            bot.on('ready', () => {
                console.log("Start took: " + ((new Date).getTime() - start) + "MS")
                //Framework.start(bot)

                if (bot.shard) {
                    console.log("Shard #"+bot.shard.id+" active with "+bot.guilds.size+" guilds")
                    bot.user.setPresence({ game: { name: "@Nitro help | Shard " + (bot.shard.id + 1) + "/" + bot.shard.count, type: 0 } })
                } else {
                    console.log("Shard #0 active with "+bot.guilds.size+" guilds")
                    bot.user.setPresence({ game: { name: "@Nitro help | "+bot.guilds.size+" guilds", type: 0 } })
                }
            })

            /*bot.on("debug", msg => {
                if (!/heartbeat/i.test(msg)) console.log(msg);
            });*/
            bot.on("error", console.error);
            return resolve(bot);
    })

}

module.exports = Bot;