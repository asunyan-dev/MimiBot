import { Client, ActivityType, Events } from "discord.js";


export default {
    name: Events.ClientReady,
    once: true,


    async execute(client: Client) {

        console.log(`🐈 Meow! I am online as ${client.user!.tag}~!`);

        client.user!.setPresence({
            activities: [
                {
                    type: ActivityType.Custom,
                    name: "blub",
                    state: "🐈 Meow"
                }
            ],
            status: "online"
        });
    }
}