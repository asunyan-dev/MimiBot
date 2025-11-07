import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, MessageFlags } from "discord.js"


export default {
    data: new SlashCommandBuilder()
        .setName("character")
        .setDescription("Get info on an anime character")
        .addStringOption((option) => 
            option
                .setName("query")
                .setDescription("The character to search for")
                .setRequired(true)
        ),


    async execute(interaction: ChatInputCommandInteraction) {

        const query = interaction.options.getString("query", true);

        try {

            const res = await fetch(`https://api.jikan.moe/v4/characters?q=${encodeURIComponent(query)}&limit=1&fields=voices,anime,manga`).catch(() => null);


            if(!res || !res.ok) {
                return interaction.reply({content: "❌ There was an error with the API, please try again later.", flags: MessageFlags.Ephemeral});
            };


            const data: any = await res.json();

            if(!data.data || data.data.length === 0) {
                return interaction.reply({content: "❌ No character found with that name.", flags: MessageFlags.Ephemeral});
            };


            const char = data.data[0];
            

            let voiceActor: string = "N/A";

            if(char.voices && char.voices.length > 0) {
                const jpVA = char.voices.find((v: {language: string}) => v.language === "Japanese");
                if(jpVA) {
                    voiceActor = `[${jpVA.person.name}](${jpVA.person.url}) (${jpVA.language})`;
                } else {
                    const va = char.voices[0];
                    voiceActor = `[${va.person.name}](${va.person.url}) (${va.language})`;
                };
            };


            const embed = new EmbedBuilder()
                .setTitle(char.name)
                .setURL(char.url)
                .setThumbnail(char.images.jpg.image_url)
                .setDescription(char.about ? (char.about.length > 400 ? char.about.substring(0, 400) + "..." : char.about) : "No description available.")
                .setColor(0xe410d3)
                .setFooter({text: "Data from MyAnimeList (Jikan API)"})
                .addFields(
                    {name: "🈶 Kanji", value: char.name_kanji || "N/A", inline: false},
                    {name: "🎤 Voice actor", value: voiceActor, inline: false},
                    {name: "🎂 Birthday", value: char.birthday || "Unknown"},
                    {name: "📺 Anime Appearances", value: char.anime?.slice(0, 3).map((a: {anime: {title: string}}) => a.anime.title).join(", ") || "N/A", inline: false},
                    {name: "📚 Manga Appearances", value: char.manga?.slice(0, 3).map((m: {manga: {title: string}}) => m.manga.title).join(", ") || "N/A", inline: false}
                );

            return interaction.reply({embeds: [embed]});
        } catch (err) {
            console.error(err);
            return interaction.reply({content: "❌ There was an error with the API, please try again later.", flags: MessageFlags.Ephemeral});
        }
    }
}