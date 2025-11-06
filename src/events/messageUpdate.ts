import { Client, Message, Events, EmbedBuilder } from "discord.js"

import { getLog } from "../modules/logs"

import sendMessage from "../modules/sendMessage"


export default {
    name: Events.MessageUpdate,

    async execute(oldMessage: Message, newMessage: Message, client: Client) {

        if(!newMessage.guild) return;
        if(newMessage.author.bot) return;

        const guildId = newMessage.guild.id;

        const status = await getLog(guildId, "messageLogs");
        if(!status.enabled) return;

        const channelId = status.channelId!

        if(oldMessage.content !== newMessage.content) {
            

            const embed = new EmbedBuilder()
                .setTitle("Message edited")
                .setThumbnail(newMessage.author.displayAvatarURL({size: 512}))
                .setColor(0xe410d3)
                .setDescription(`**Before:**\n${oldMessage.content.substring(0, 400)}\n\n**After:**${newMessage.content.substring(0, 400)}`)
                .setFooter({text: `User ID: ${newMessage.author.id}`})
                .setTimestamp();

            try {
                await sendMessage(client, guildId, channelId, {embeds: [embed]});
            } catch (err) {
                console.log(err);
            }
        }
    }
}