import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    InteractionContextType,
    PermissionFlagsBits,
    MessageFlags,
    EmbedBuilder
} from "discord.js";

import {
    getWarningStatus,
    addWarn
} from "../modules/warning"


export default {
    data: new SlashCommandBuilder()
        .setName("warn")
        .setDescription("Warn a member")
        .setContexts(InteractionContextType.Guild)
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption((option) => 
            option
                .setName("user")
                .setDescription("The user to warn")
                .setRequired(true)
        )
        .addStringOption((option) => 
            option
                .setName("reason")
                .setDescription("Reason of the warn")
                .setRequired(true)
        ),

    
    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.guild) return;

        const status = await getWarningStatus(interaction.guild.id);
        if(!status.enabled) return interaction.reply({content: "❌ Warnings are disabled on this server.", flags: MessageFlags.Ephemeral});

        const member = await interaction.guild.members.fetch(interaction.user.id).catch(() => null);
        if(!member) return;

        const user = interaction.options.getUser("user", true);
        const target = await interaction.guild.members.fetch(user.id).catch(() => null);
        if(!target) return interaction.reply({content: "❌ Member not found.", flags: MessageFlags.Ephemeral});

        const reason = interaction.options.getString("reason", true);


        addWarn(interaction.guild.id, target.id, member.id, reason);


        const embed = new EmbedBuilder()
            .setTitle(`You were warned in ${interaction.guild.name}!`)
            .setDescription(`**With reason:**\n${reason}`)
            .setThumbnail(interaction.guild.iconURL({size: 512}))
            .setColor(0xe410d3)
            .setFooter({text: "This message was sent by server staff"})
            .setTimestamp();

        try {
            await target.send({embeds: [embed]});
            return interaction.reply({content: "✅ Member warned.", flags: MessageFlags.Ephemeral});
        } catch (err) {
            console.error(err);
            return interaction.reply({content: "✅ Member warned.\n⚠️ Failed to DM member. They probably have DMs closed.", flags: MessageFlags.Ephemeral});
        }
    }
}