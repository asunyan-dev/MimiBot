import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, MessageFlags } from "discord.js";


export default {
    data: new SlashCommandBuilder()
        .setName("wyr")
        .setDescription("Get a would you rather question"),


    async execute(interaction: ChatInputCommandInteraction) {

        try {

            const res = await fetch("https://api.popcat.xyz/v2/wyr").catch(() => null);

            if(!res || !res.ok) {
                return interaction.reply({content: "❌ There was an error with the API, please try again later.", flags: MessageFlags.Ephemeral});
            };

            const data: any = await res.json() as {
                error: boolean, 
                message: {
                    error?: string,
                    ops1?: string,
                    ops2?: string
                }
            };

            if(data.error) {
                return interaction.reply({content: `❌ ${data.message.error}`, flags: MessageFlags.Ephemeral});
            };

            if(!data || !data.message.ops1 || !data.message.ops2) {
                return interaction.reply({content: "❌ Failed to get question, please try again later.", flags: MessageFlags.Ephemeral});
            };


            const embed = new EmbedBuilder()
                .setTitle("Would you rather:")
                .setDescription(`${data.message.ops1}\n\nor\n\n${data.message.ops2}`)
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