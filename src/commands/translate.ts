import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, MessageFlags } from "discord.js";
const languages = require('../data/languages.json');

export default {
    data: new SlashCommandBuilder()
        .setName("translate")
        .setDescription("Translate your text to another language")
        .addStringOption((option) => 
            option
                .setName("text")
                .setDescription("The text to translate")
                .setRequired(true)
        )
        .addStringOption((option) => 
            option
                .setName("to")
                .setDescription("The language to translate to")
                .setRequired(true)
                .addChoices(
                    ...languages.map((lang: { name: any; code: any; }) => ({
                        name: lang.name,
                        value: lang.code
                    }))
                )
        ),


    async execute(interaction: ChatInputCommandInteraction) {
        const text = interaction.options.getString("text", true);

        const to = interaction.options.getString("to", true);

        try {
            const res = await fetch(`https://api.popcat.xyz/v2/translate?to=${to}&text=${encodeURIComponent(text)}`).catch(() => null);

            if(!res || !res.ok) {
                return interaction.reply({content: "❌ There was an error with the API, please try again later.", flags: MessageFlags.Ephemeral});
            };

            const data: any = await res.json();

            if(!data) return interaction.reply({content: "❌ Failed to get translation. Please try again later.", flags: MessageFlags.Ephemeral});

            if(data.error) {
                return interaction.reply({content: `❌ ${data.message.error}`, flags: MessageFlags.Ephemeral});
            };

            const embed = new EmbedBuilder()
                .setTitle("Translation")
                .setDescription(`**Original text:**\n${text}\n\n**To ${to}:**\n${data.message.translated}`)
                .setColor(0xe410d3)
                .setFooter({text: "Provided by PopCat API"})
                .setTimestamp();

            return interaction.reply({embeds: [embed]});
        } catch (err) {
            console.error(err);
            return interaction.reply({content: "❌ There was an error with the API, please try again later.", flags: MessageFlags.Ephemeral});
        }
    }
}