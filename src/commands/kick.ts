import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    InteractionContextType,
    PermissionFlagsBits,
    MessageFlags
} from "discord.js";


export default {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kick a member")
        .setContexts(InteractionContextType.Guild)
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addUserOption((option) => 
            option
                .setName("user")
                .setDescription("The user to kick")
                .setRequired(true)
        )
        .addStringOption((option) => 
            option
                .setName("reason")
                .setDescription("Reason for the kick")
                .setRequired(false)
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        if(!interaction.guild) return;

        const member = await interaction.guild.members.fetch(interaction.user.id).catch(() => null);
        if(!member) return;

        const user = interaction.options.getUser("user", true);
        const target = await interaction.guild.members.fetch(user.id).catch(() => null);
        if(!target) return interaction.reply({content: "❌ Member not found.", flags: MessageFlags.Ephemeral});

        const reason = interaction.options.getString("reason", false) || "No reason provided.";

        if(target.roles.highest.position >= member.roles.highest.position) {
            return interaction.reply({content: "❌ You can't kick someone with a higher role than you.", flags: MessageFlags.Ephemeral});
        };

        if(target.roles.highest.position >= interaction.guild.members.me!.roles.highest.position) {
            return interaction.reply({content: "❌ I can't kick someone that has a higher role than me.", flags: MessageFlags.Ephemeral});
        }

        if(!target.kickable) return interaction.reply({content: "❌ This member is not kickable.", flags: MessageFlags.Ephemeral});

        await target.kick(reason);

        return interaction.reply({content: "✅ Member kicked."});
    }
}