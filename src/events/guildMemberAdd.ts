import {
    GuildMember,
    Events,
    Client,
    EmbedBuilder
} from "discord.js";

import { getLog } from "../modules/logs";

import sendMessage from "../modules/sendMessage";


export default {
    name: Events.GuildMemberAdd,

    async execute(member: GuildMember, client: Client) {
        const status = await getLog(member.guild.id, "joinLeave");
        if(!status.enabled) return;

        const guildId = member.guild.id;
        const channelId = status.channelId!

        const embed = new EmbedBuilder()
            .setTitle("Member joined")
            .setThumbnail(member.displayAvatarURL({size: 512}))
            .setColor(0xe410d3)
            .setDescription(`<@${member.id}>\n\nAccount Created: <t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`)
            .setFooter({text: `User ID: ${member.id}`})
            .setTimestamp();

        try {
            await sendMessage(client, guildId, channelId, {embeds: [embed]});
        } catch (error) {
            console.log(error);
        }
    }
}