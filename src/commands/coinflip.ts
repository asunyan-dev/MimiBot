import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";


export default {

    data: new SlashCommandBuilder()
        .setName("coinflip")
        .setDescription("Flip a coin!")
        .addStringOption((option) => 
            option
                .setName("choice")
                .setDescription("Your choice")
                .setRequired(true)
                .addChoices(
                    {name: "Heads", value: "heads"},
                    {name: "Tails", value: "tails"}
                )
        ),


    async execute(interaction: ChatInputCommandInteraction) {
        const choice = interaction.options.getString("choice", true);


        const side = Math.random() < 0.5 ? "heads" : "tails";

        let resultEmbed = new EmbedBuilder()
            .setTitle("🐈 Coin Flip result")
            .setColor(0xe410d3)
            .setTimestamp();

        if(side === choice) {
            resultEmbed.setDescription(`🎉 It landed on ${side.charAt(0).toUpperCase() + side.slice(1)}!`);
            return interaction.reply({embeds: [resultEmbed]});
        } else {
            resultEmbed.setDescription(`😥 It landed on ${side.charAt(0).toUpperCase() + side.slice(1)}...`);
            return interaction.reply({embeds: [resultEmbed]});
        };
    }
}