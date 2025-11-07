import { ChatInputCommandInteraction, SlashCommandBuilder, ModalBuilder, ComponentType, TextInputStyle, InteractionContextType, MessageFlags } from "discord.js";

import { getSuggest } from "../modules/suggestions";


export default {
    data: new SlashCommandBuilder()
        .setName("suggest")
        .setDescription("Make a new suggestion for the server.")
        .setContexts(InteractionContextType.Guild),

    async execute(interaction: ChatInputCommandInteraction) {
        if(!interaction.guild) return;
        const status = await getSuggest(interaction.guild.id);

        if(!status.enabled) return interaction.reply({content: "❌ Suggestions are disabled.", flags: MessageFlags.Ephemeral});


        const modal = new ModalBuilder()
            .setCustomId("suggestion")
            .setTitle("New Suggestion")
            .addLabelComponents(
                {
                    type: ComponentType.Label,
                    label: "Your Suggestion",
                    description: "Fill in all details below.",
                    component: {
                        type: ComponentType.TextInput,
                        style: TextInputStyle.Paragraph,
                        placeholder: "Type your suggestion here...",
                        custom_id: "text",
                        required: true
                    }
                }
            ).toJSON();

        await interaction.showModal(modal);
    }
}