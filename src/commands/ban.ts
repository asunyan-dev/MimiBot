import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  InteractionContextType,
  PermissionFlagsBits,
  MessageFlags,
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a member")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to ban")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason for the ban")
        .setRequired(false),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) return;

    const user = interaction.options.getUser("user", true);

    const member = await interaction.guild.members
      .fetch(interaction.user.id)
      .catch(() => null);

    if (!member) return;

    const target = await interaction.guild.members
      .fetch(user.id)
      .catch(() => null);

    if (!target) {
      return interaction.reply({
        content: "❌ Couldn't find member.",
        flags: MessageFlags.Ephemeral,
      });
    }

    if (member.roles.highest.position <= target.roles.highest.position) {
      return interaction.reply({
        content: "❌ You can't ban someone with a higher role than you.",
        flags: MessageFlags.Ephemeral,
      });
    }

    if (
      target.roles.highest.position >=
      interaction.guild.members.me!.roles.highest.position
    ) {
      return interaction.reply({
        content: "❌ I can't ban someone with a higher role than me.",
        flags: MessageFlags.Ephemeral,
      });
    }

    if (!target.bannable) {
      return interaction.reply({
        content: "❌ This member is not bannable.",
        flags: MessageFlags.Ephemeral,
      });
    }

    const reason =
      interaction.options.getString("reason", false) || "No reason provided.";

    try {
      await target.ban({ reason: reason });
      return interaction.reply({
        content: "✅ Member Banned.",
        flags: MessageFlags.Ephemeral,
      });
    } catch (error) {
      console.error(error);
      return interaction.reply({
        content: "❌ Failed to ban member. Do I have the right permissions?",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
