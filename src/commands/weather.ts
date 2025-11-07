import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, MessageFlags } from "discord.js";


export default {
    data: new SlashCommandBuilder()
        .setName("weather")
        .setDescription("Get the current weather for a city.")
        .addStringOption((option) => 
            option
                .setName("location")
                .setDescription("Location. Format: 'City, Country/State'")
                .setRequired(true)
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const query = interaction.options.getString("location", true);

        try {

            const res = await fetch(`https://api.popcat.xyz/v2/weather?q=${encodeURIComponent(query)}`).catch(() => null);

            if(!res || !res.ok) {
                return interaction.reply({content: "❌ There was an error with the API, please try again later.", flags: MessageFlags.Ephemeral});
            };


            const data: any = await res.json();

            if(data.error) {
                return interaction.reply({content: `❌ ${data.message.error}`, flags: MessageFlags.Ephemeral});
            };

            const weather = data.message[0];
            const location = weather.location.name;
            const current = weather.current;


            const embed = new EmbedBuilder()
                .setTitle(`Current weather for ${location}`)
                .setDescription(`**Weather observed on ${current.day}, ${current.date} at ${current.observationtime} (local time).**\n\n**Current weather:** ${current.skytext}\n\n**Temperature:** ${current.temperature}°C | **Feels like:** ${current.feelslike}°C\n\n**Humidity:** ${current.humidity}%\n\n**Wind:** ${current.winddisplay}`)
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