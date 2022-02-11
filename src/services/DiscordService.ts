const Discord = require('discord.js');
import { MessageEmbed } from 'discord.js';
import logger from 'npmlog';
import * as DateTimeHelper from '../helpers/DateTimeHelper';

export async function sendStatusMessage(): Promise<void> {
    let message: string = `The filter query has been updated on ${DateTimeHelper.getDutchDateTime('long')}`;

    const statusEmbed = new MessageEmbed()
	.setColor('#0099ff')
	.setTitle('Better_Task_Filter STATUS')
	.setAuthor({ name: 'bettertaskfilter-bot' })
	.setDescription(`${message}`)
	.setTimestamp();

    const client: any = new Discord.Client({ intents: ['GUILDS'] });
    client.login(process.env.DISCORD_TOKEN);

    client.on('ready', async () => {
        const botChannel = client.channels.cache.find((channel: any) => channel.name === process.env.DISCORD_CHANNEL_NAME);
        await botChannel.send({ embeds: [statusEmbed] });
        logger.info(`From Discord module @ ${DateTimeHelper.getDutchDateTime('short')}`, 'The Embed has been sent to the channel.');
        client.destroy();
    })
}