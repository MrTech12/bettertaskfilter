const Discord = require("discord.js");

exports.sendStatusMessage = (): void => {

    let localeOptions: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: "numeric" };
    let dateTimeNow = new Date().toLocaleString('nl-NL', localeOptions);
    let message = `Tasks have been sorted @ ${dateTimeNow}`;

    const client = new Discord.Client({intents: ["GUILDS"]});
    client.login(process.env.DISCORD_TOKEN);

    client.on('ready', async () => {
        const botChannel = client.channels.cache.find((channel: any) => channel.name === process.env.DISCORD_CHANNEL_NAME);
        await botChannel.send(message);
        client.destroy();
    })
}