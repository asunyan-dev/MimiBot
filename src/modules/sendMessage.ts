import { Client, Message, MessageCreateOptions } from "discord.js";


export default async function sendMessage(
    client: Client,
    guildId: string,
    channelId: string,
    data: string | MessageCreateOptions
): Promise<Message> {

    const guild = await client.guilds.fetch(guildId)
    if(!guild) {
        throw new Error("Guild not found.");
    };

    const channel = await guild.channels.fetch(channelId).catch(() => null);
    if(!channel) {
        throw new Error("Channel not found.");
    };

    if(!channel.isSendable()) {
        throw new Error("Can't send message in this channel.");
    };

    return await channel.send(data);
}