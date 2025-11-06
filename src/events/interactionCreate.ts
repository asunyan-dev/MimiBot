import { Client, Collection, SlashCommandBuilder, Interaction, MessageFlags, ChatInputCommandInteraction, Events, EmbedBuilder } from "discord.js";


import { getWarnings } from "../modules/warning";

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
        };


        if(interaction.isModalSubmit()) {
            if(interaction.customId.startsWith("warnings_")) {
                if(!interaction.guild) return;

                const userId = interaction.customId.replace("warnings_", "");

                const warnings = await getWarnings(interaction.guild.id, userId);

                const warningCase = interaction.fields.getTextInputValue("case");

                const member = await interaction.guild.members.fetch(userId).catch(() => null);
                if(!member) return;

                const id = Number(warningCase);

                const warning = warnings.find(warning => warning.id === id);

                if(!warning) return interaction.reply({content: "❌ Case not found.", flags: MessageFlags.Ephemeral});

                const embed = new EmbedBuilder()
                    .setTitle(`${member.displayName} - Case #${id}`)
                    .setDescription(`**Warned by:**\n<@${warning.mod}> | ID: ${warning.mod}\n\n**Reason:**\n${warning.reason}`)
                    .setThumbnail(member.displayAvatarURL({size: 512}))
                    .setFooter({text: `Case ${id} out of ${warnings.length} cases.`})
                    .setTimestamp();

                return interaction.reply({embeds: [embed]});
            }
        }
    }
}