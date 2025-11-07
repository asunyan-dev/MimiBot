import { ChatInputCommandInteraction, SlashCommandBuilder, MessageFlags, EmbedBuilder, ActionRowBuilder, ComponentType, StringSelectMenuBuilder } from "discord.js";

import fs from "fs"
import path from "path"


export default {
    data: new SlashCommandBuilder()
        .setName("topic")
        .setDescription("Get a random topic starter"),


    async execute(interaction: ChatInputCommandInteraction) {
        const topicsPath = path.join(__dirname, "../data/topics.json");

        let topics = require(topicsPath);

        const categories = Object.keys(topics);


        const embed = new EmbedBuilder()
            .setTitle("Choose a category")
            .setDescription("Use the select menu below to select a topic category. You have 60 seconds.")
            .setColor(0xe410d3);

        const row = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId("category")
                .setPlaceholder("Select a category here...")
                .addOptions(categories.map((cat) => ({
                    label: cat,
                    value: cat
                })))
        ).toJSON();


        const reply = await interaction.reply({embeds: [embed], components: [row]});


        const collector = reply.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            time: 60_000
        });


        collector.on("collect", async (i) => {
            if(i.user.id !== interaction.user.id) {
                return interaction.reply({content: "❌ This menu is not for you!", flags: MessageFlags.Ephemeral});
            };

            const category = i.values[0];

            const topicsList: [] = topics[category];

            const randomTopic = topicsList[Math.floor(Math.random() * topicsList.length)];

            const embed2 = new EmbedBuilder()
                .setTitle("Random Topic")
                .setDescription(randomTopic)
                .setColor(0xe410d3)
                .setFooter({text: `Category: ${category.charAt(0).toUpperCase() + category.slice(1)}`})
                .setTimestamp();

            return i.update({embeds: [embed2], components: []});
        });

        collector.on("end", async () => {
            try {
                interaction.followUp({components: []});
            } catch {};
        });
    }
}