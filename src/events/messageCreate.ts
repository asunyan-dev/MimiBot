import { Client, Message, Events } from "discord.js";
import { getAfk, removeAfk } from "../modules/afk";


export default {
    name: Events.MessageCreate,


    async execute(message: Message, client: Client) {
        if(!message.guild) return; 
        if(message.author.bot) return;


        const status = await getAfk(message.author.id);

        if(status) {
            await removeAfk(message.author.id);
            message.reply({content: "🐈 Meow~ Welcome Back!\nI removed your AFK status~"});
        };


        if(message.mentions.users.size > 0) {
            message.mentions.users.forEach(user => {
                const afkStatus = getAfk(user.id);
                if(afkStatus) message.reply(`🐈 Meow~ ${user.username} is AFK: ${afkStatus}`)
            });
        };
    }
}