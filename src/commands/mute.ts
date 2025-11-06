import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    InteractionContextType,
    PermissionFlagsBits,
    MessageFlags
} from "discord.js";

import ms from "ms";

export default {
    data: new SlashCommandBuilder()
        .setName("mute")
        .setDescription("Mute a member")
        .setContexts(InteractionContextType.Guild)
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption((option) => 
            option
                .setName("user")
                .setDescription("The user to mute")
                .setRequired(true)
        )
        .addStringOption((option) => 
            option
                .setName("duration")
                .setDescription("Duration of the mute, example: 1 day, 3 hours")
                .setRequired(true)
        )
        .addStringOption((option) => 
            option
                .setName("reason")
                .setDescription("Reason for the mute")
                .setRequired(false)
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        if(!interaction.guild) return;
        const member = await interaction.guild.members.fetch(interaction.user.id).catch(() => null);
        if(!member) return;

        const user = interaction.options.getUser("user", true);
        const reason = interaction.options.getString("reason", false) || "No reason provided.";
        const durationRaw = interaction.options.getString("duration", true);

        /*@ts-ignore*/
        const duration = ms(durationRaw);

        const target = await interaction.guild.members.fetch(user.id).catch(() => null);
        if(!target) return interaction.reply({content: "❌ No member found.", flags: MessageFlags.Ephemeral});

        if(member.roles.highest.position <= target.roles.highest.position) {
            return interaction.reply({content: "❌ You can't mute someone with a higher role than you.", flags: MessageFlags.Ephemeral});
        };

        if(target.roles.highest.position >= interaction.guild.members.me!.roles.highest.position) {
            return interaction.reply({content: "❌ I can't mute someone with a higher role than me.", flags: MessageFlags.Ephemeral});
        };

        if(!target.moderatable) {
            return interaction.reply({content: "❌ This member is not mutable.", flags: MessageFlags.Ephemeral});
        };

        await target.timeout(duration, reason);

        return interaction.reply({content: "✅ Member muted."});
        
    }
}