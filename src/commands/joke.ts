import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, MessageFlags } from "discord.js";


export default {
    data: new SlashCommandBuilder()
        .setName("joke")
        .setDescription("Get a random joke"),


    async execute(interaction: ChatInputCommandInteraction) {

        try {

            const res = await fetch("https://api.popcat.xyz/v2/joke").catch(() => null);

            if(!res || !res.ok) {
                return interaction.reply({content: "❌ There was an error with the API, please try again later.", flags: MessageFlags.Ephemeral});
            };

            const data: any = await res.json() as {
                error: boolean,
                message: {
                    joke?: string,
                    error?: string
                }
            };

            if(!data || !data.message.joke) {
                return interaction.reply({content: "❌ Failed to get joke, please try again later.", flags: MessageFlags.Ephemeral});
            };

            if(data.error) {
                return interaction.reply({content: `❌ ${data.message.error!}`, flags: MessageFlags.Ephemeral});
            };


            const embed = new EmbedBuilder()
                .setTitle("Random joke")
                .setDescription(data.message.joke)
                .setColor(0xe410d3)
                .setFooter({text: "Provided by PopCat API"})
                .setTimestamp();

            return interaction.reply({embeds: [embed]});
        } catch (err) {
            console.error(err);
            return interaction.reply({content: "❌ There was an error with the API, please try again later.", flags: MessageFlags.Ephemeral});
        };
    }
}