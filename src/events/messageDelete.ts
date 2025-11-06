import { Message, Client, Events, EmbedBuilder } from "discord.js";

import { getLog } from "../modules/logs";

import sendMessage from "../modules/sendMessage";


export default {
    name: Events.MessageDelete,

    async execute(message: Message, client: Client) {
        if(message.partial) {
            try {
                message.fetch()
            } catch (err) {
                console.log(err);
                return;
            };
        };

        if(!message.guild) return;
        if(message.author.bot) return;

        const guildId = message.guild.id;

        const status = await getLog(guildId, "messageLogs");
        if(!status.enabled) return;

        const channelId = status.channelId!

        let description = []

        if(message.content) description.push(`**Content:**\n${message.content.substring(0, 400)}`);
        if(message.stickers.size > 0) {
            description.push(`**Stickers:**\n${message.stickers.map(sticker => sticker.name).join("\n")}`);
        };
        if(message.attachments.size > 0) {
            description.push(`**Attachments:**\n${message.attachments.map(a => a.name).join("\n")}`);
        };

        const embed = new EmbedBuilder()
            .setTitle("Message deleted")
            .setThumbnail(message.author.displayAvatarURL({size: 512}))
            .setColor(0xe410d3)
            .setDescription(description.length ? description.join("\n\n") : "No content found.")
            .setFooter({text: `User ID: ${message.author.id}`})
            .setTimestamp();

        try {
            await sendMessage(client, guildId, channelId, {embeds: [embed]});
        } catch (err) {
            console.log(err);
        }
    }
}