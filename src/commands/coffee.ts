import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, MessageFlags } from "discord.js";



export default {
    data: new SlashCommandBuilder()
        .setName("coffee")
        .setDescription("Get a random coffee pic"),


    async execute(interaction: ChatInputCommandInteraction) {

        try {

            const res = await fetch("https://coffee.alexflipnote.dev/random.json").catch(() => null);

            if(!res || !res.ok) {
                return interaction.reply({content: "❌ There was an error with the API, please try again later.", flags: MessageFlags.Ephemeral});
            };


            const data: any = await res.json() as {file: string};

            if(!data || !data.file) {
                return interaction.reply({content: "❌ Failed to get image, please try again later.", flags: MessageFlags.Ephemeral});
            };

            const embed = new EmbedBuilder()
                .setTitle("☕ It's coffee time!")
                .setImage(data.file)
                .setColor(0xe410d3)
                .setFooter({text: "Provided by AlexFlipNote API"})
                .setTimestamp();

            return interaction.reply({embeds: [embed]});
        } catch (err) {
            console.error(err);
            return interaction.reply({content: "❌ There was an error with the API, please try again later.", flags: MessageFlags.Ephemeral});
        };
    }
}