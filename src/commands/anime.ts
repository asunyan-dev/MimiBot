import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, MessageFlags } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("anime")
        .setDescription("Get info on an anime")
        .addStringOption(option => 
            option.setName("query").setDescription("The anime you're searching for").setRequired(true)
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const query = interaction.options.getString("query", true);

        try {
            const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=1`).catch(() => null);

            if(!res || !res.ok) {
                return interaction.reply({content: "❌ There was an error with the API, please try again later.", flags: MessageFlags.Ephemeral});
            };

            const data: any = await res.json();

            if(!data) return interaction.reply({content: "❌ There was an error with the API, please try again later.", flags: MessageFlags.Ephemeral});

            const anime = data.data[0];

            const embed = new EmbedBuilder()
                .setTitle(`${anime.title} (${anime.year ? anime.year.toString() : "Unknown year"})`)
                .setThumbnail(anime.images.jpg.image_url)
                .setDescription(anime.synopsis ? anime.synopsis.substring(0, 400) : "No synopsis available.")
                .setColor(0xe410d3)
                .setFooter({text: "Provided by Jikan API"})
                .setTimestamp();

            return interaction.reply({embeds: [embed]});
        } catch (error) {
            console.error(error);
            return interaction.reply({content: "❌ There was an error with the API, please try again later.", flags: MessageFlags.Ephemeral});
        }
    }
}