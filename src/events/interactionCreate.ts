import { Client, Collection, SlashCommandBuilder, Interaction, MessageFlags, ChatInputCommandInteraction, Events } from "discord.js";


type Command = {
    data: SlashCommandBuilder;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
};

export default {
    name: Events.InteractionCreate,

    async execute(interaction: Interaction, client: Client) {
        if(interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if(!command) return;

            if(!client.cooldowns.has(command.data.name)) {
                client.cooldowns.set(command.data.name, new Collection());
            };

            const now = Date.now();
            const timestamps = client.cooldowns.get(command.data.name)!
            const cooldownAmount = (command.cooldown || 3) * 1000;

            if(timestamps.has(interaction.user.id)) {
                const expirationTime = timestamps.get(interaction.user.id)! + cooldownAmount;

                if(now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000;
                    return interaction.reply({content: `⏳ Please wait ${timeLeft.toFixed(1)} more second(s) before using /${command.data.name} again.`, flags: MessageFlags.Ephemeral});
                };
            };

            timestamps.set(interaction.user.id, now);
            setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);


            try {
                await command.execute(interaction);
            } catch (err) {
                console.error(err);
                if(interaction.replied || interaction.deferred) {
                    await interaction.followUp({content: "❌ There was an error executing this command!", flags: MessageFlags.Ephemeral});
                } else {
                    await interaction.reply({content: "❌ There was an error executing this command!", flags: MessageFlags.Ephemeral});
                }
            }
        }
    }
}