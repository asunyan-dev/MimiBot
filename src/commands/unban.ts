import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  InteractionContextType,
  PermissionFlagsBits,
  MessageFlags,
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unban a user")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption((option) =>
      option.setName("id").setDescription("ID of the user").setRequired(true),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) return;

    const id = interaction.options.getString("id", true);

    const ban = await interaction.guild.bans.fetch(id).catch(() => null);

    if (!ban) {
      return interaction.reply({
        content: "❌ Couldn't find banned user. Are they actually banned?",
        flags: MessageFlags.Ephemeral,
      });
    }

    try {
      await interaction.guild.bans.remove(id);
      return interaction.reply({
        content: "✅ User Unbanned",
        flags: MessageFlags.Ephemeral,
      });
    } catch (error) {
      console.error(error);
      return interaction.reply({
        content: "❌ Failed to unban member. Do I have the right permissions?",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
