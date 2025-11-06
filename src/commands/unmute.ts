import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    InteractionContextType,
    PermissionFlagsBits,
    MessageFlags
} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("unmute")
        .setDescription("Unmute a member")
        .setContexts(InteractionContextType.Guild)
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption((option) => 
            option
                .setName("user")
                .setDescription("The user to unmute")
                .setRequired(true)
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        if(!interaction.guild) return;

        const member = await interaction.guild.members.fetch(interaction.user.id).catch(() => null);
        if(!member) return;

        const user = interaction.options.getUser("user", true);
        const target = await interaction.guild.members.fetch(user.id).catch(() => null);
        if(!target) return interaction.reply({content: "❌ Couldn't find member.", flags: MessageFlags.Ephemeral});

        if(!target.isCommunicationDisabled()) {
            return interaction.reply({content: "❌ This member is not muted!", flags: MessageFlags.Ephemeral});
        };

        if(target.roles.highest.position >= member.roles.highest.position) {
            return interaction.reply({content: "❌ You can't unmute someone with a higher role than you.", flags: MessageFlags.Ephemeral});
        };

        if(target.roles.highest.position >= interaction.guild.members.me!.roles.highest.position) {
            return interaction.reply({content: "❌ I can't unmute someone with a higher role than me.", flags: MessageFlags.Ephemeral});
        };

        if(!target.moderatable) {
            return interaction.reply({content: "❌ This member can't be unmuted.", flags: MessageFlags.Ephemeral});
        };

        await target.timeout(null);

        return interaction.reply({content: "✅ Member unmuted."});
    }
}