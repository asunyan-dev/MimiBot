import { Events, Client, VoiceState, EmbedBuilder } from "discord.js";

import { getLog } from "../modules/logs";

import sendMessage from "../modules/sendMessage";


import { getUser, getChannel } from "../modules/logIgnore"

export default {
    name: Events.VoiceStateUpdate,


    async execute(oldState: VoiceState, newState: VoiceState, client: Client) {
        const guildId = newState.guild.id;

        const status = await getLog(guildId, "voiceLogs");
        if(!status.enabled) return;

        const channelId = status.channelId!

        if(!newState.member) return;

        const userStatus = await getUser(guildId, newState.member.id);
        if(userStatus) return;

        if(!oldState.channel && newState.channel) {
            const channelStatus = await getChannel(guildId, newState.channel.id);
            if(channelStatus) return;
            const embed = new EmbedBuilder()
                .setTitle("Voice joined")
                .setDescription(`<@${newState.member.id}> joined voice channel <#${newState.channel.id}>`)
                .setColor(0xe410d3)
                .setFooter({text: `User ID: ${newState.member.id}`})
                .setTimestamp();

            try {
                await sendMessage(client, guildId, channelId, {embeds: [embed]});
            } catch (err) {
                console.log(err);
            }
        };


        if(oldState.channel && !newState.channel) {
            const channelStatus = await getChannel(guildId, oldState.channel.id);
            if(channelStatus) return;

            const embed = new EmbedBuilder()
                .setTitle("Voice Left")
                .setDescription(`<@${newState.member.id}> left voice channel <#${oldState.channel.id}>`)
                .setColor(0xe410d3)
                .setFooter({text: `User ID: ${newState.member.id}`})
                .setTimestamp();

            try {
                await sendMessage(client, guildId, channelId, {embeds: [embed]});
            } catch (err) {
                console.log(err);
            };
        };


        if(oldState.channel !== newState.channel) {
            const oldStatus = await getChannel(guildId, oldState.channel!.id);
            const newStatus = await getChannel(guildId, newState.channel!.id);

            if(oldStatus || newStatus) return;
            const embed = new EmbedBuilder()
                .setTitle("Moved voice")
                .setDescription(`<@${newState.member.id}> moved from voice channel <#${oldState.channel!.id}> to voice channel <#${newState.channel!.id}>`)
                .setColor(0xe410d3)
                .setFooter({text: `User ID: ${newState.member.id}`})
                .setTimestamp();

            try {
                await sendMessage(client, guildId, channelId, {embeds: [embed]});
            } catch (err) {
                console.log(err);
            }
        }
    }
}