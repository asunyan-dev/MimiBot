import { Client, GuildMember, EmbedBuilder, Events } from "discord.js";

import { getLog } from "../modules/logs";

import sendMessage from "../modules/sendMessage";

export default {
    name: Events.GuildMemberRemove,

    async execute(member: GuildMember, client: Client) {
        if(member.partial) {
            try {
                member.fetch()
            } catch (err) {
                console.log(err);
                return;
            };
        };

        const status = await getLog(member.guild.id, "joinLeave");
        if(!status.enabled) return;

        const guildId = member.guild.id;
        const channelId = status.channelId!

        const embed = new EmbedBuilder()
            .setTitle("Member Left")
            .setThumbnail(member.displayAvatarURL({size: 512}))
            .setColor(0xe410d3)
            .setDescription(`<@${member.id}>\n\nMember since: ${member.joinedTimestamp ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : "Unknown"}`)
            .setFooter({text: `User ID: ${member.id}`})
            .setTimestamp();

        try {
            await sendMessage(client, guildId, channelId, {embeds: [embed]})
        } catch (err) {
            console.log(err);
        }
    }
}