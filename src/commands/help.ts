import { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("help").setDescription("Commands list."),


    async execute(interaction: ChatInputCommandInteraction, client: Client) {

        const commands = client.commands;

        const embed = new EmbedBuilder()
            .setTitle("🐈 MimiBot - Command List")
            .setColor(0xe410d3)
            .setDescription(
                commands.map(command => `\`/${command.data.name}\`\n${command.data.description}`).join("\n\n")
            )
            .setThumbnail(client.user!.avatarURL({size: 512}))
            .setTimestamp();

        return interaction.reply({embeds: [embed]});
    }
}