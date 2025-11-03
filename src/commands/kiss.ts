import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, MessageFlags } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("kiss").setDescription("Kiss another user")
        .addUserOption(option => 
            option.setName("user").setDescription("The user to hug").setRequired(true)
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const user = interaction.options.getUser("user", true);

        try {
            const res = await fetch("https://nekos.life/api/v2/img/kiss").catch(() => null);

            if(!res || !res.ok) {
                return interaction.reply({content: "❌ There was an error with the API, please try again later.", flags: MessageFlags.Ephemeral});
            };


            const data: any = await res.json();


            if(!data) {
                return interaction.reply({content: "❌ Failed to fetch image, please try again later.", flags: MessageFlags.Ephemeral});
            };

            const embed = new EmbedBuilder()
                .setTitle(`${interaction.user.displayName} kisses ${user.displayName}`)
                .setImage(data.url)
                .setColor(0xe410d3)
                .setFooter({text: "Provided by nekos.life"})
                .setTimestamp();

            return interaction.reply({embeds: [embed]});
        } catch (error) {
            console.error(error);
            return interaction.reply({content: "❌ There was an error with the API, please try again later.", flags: MessageFlags.Ephemeral});
        }
    }
}