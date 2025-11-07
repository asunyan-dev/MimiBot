import { ChatInputCommandInteraction, SlashCommandBuilder, ModalBuilder, ComponentType, TextInputStyle } from "discord.js";


export default {
    data: new SlashCommandBuilder()
        .setName("request")
        .setDescription("Request a feature or command to the bot owner"),


    async execute(interaction: ChatInputCommandInteraction) {

        const modal = new ModalBuilder()
            .setCustomId("request")
            .setTitle("New request")
            .addLabelComponents(
                {
                    type: ComponentType.Label,
                    label: "Your name",
                    component: {
                        type: ComponentType.TextInput,
                        custom_id: "name",
                        style: TextInputStyle.Short,
                        required: true
                    }
                },
                {
                    type: ComponentType.Label,
                    label: "Your request",
                    component: {
                        type: ComponentType.TextInput,
                        custom_id: "text",
                        style: TextInputStyle.Paragraph,
                        required: true
                    }
                }
            ).toJSON();

        await interaction.showModal(modal);
    }
}