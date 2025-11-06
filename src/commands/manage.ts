import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  InteractionContextType,
  PermissionFlagsBits,
  MessageFlags,
} from "discord.js";

import {
  enableRoles,
  editReference,
  disableRoles,
  getRoles,
  getStatus,
} from "../modules/customRole";

export default {
  data: new SlashCommandBuilder()
    .setName("manage")
    .setDescription("Manage modules")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommandGroup((group) =>
      group
        .setName("custom-role")
        .setDescription("Manage custom roles on your server.")
        .addSubcommand((sub) =>
          sub
            .setName("enable")
            .setDescription("Enable custom roles.")
            .addRoleOption((option) =>
              option
                .setName("reference-role")
                .setDescription("The role that will be above all custom roles.")
                .setRequired(true),
            ),
        )
        .addSubcommand((sub) =>
          sub
            .setName("edit-reference")
            .setDescription("Edit the reference role.")
            .addRoleOption((option) =>
              option
                .setName("role")
                .setDescription("The new reference role")
                .setRequired(true),
            ),
        )
        .addSubcommand((sub) =>
          sub
            .setName("disable")
            .setDescription("Disable custom roles for the server."),
        ),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) return;
    const group = interaction.options.getSubcommandGroup();
    const sub = interaction.options.getSubcommand();

    const status = getStatus(interaction.guild.id);

    if (group === "custom-role") {
      if (sub === "enable") {
        if (status)
          return interaction.reply({
            content: "❌ Custom roles are already enabled in the server!",
            flags: MessageFlags.Ephemeral,
          });

        const referenceRole = interaction.options.getRole(
          "reference-role",
          true,
        );

        if (
          referenceRole.position >
          interaction.guild.members.me!.roles.highest.position
        ) {
          return interaction.reply({
            content:
              "❌ Failed to enable roles. The reference role is higher than my highest role.",
            flags: MessageFlags.Ephemeral,
          });
        }

        enableRoles(interaction.guild.id, referenceRole.id);

        return interaction.reply({
          content: "✅ Custom roles enabled for the server!",
        });
      }

      if (sub === "edit-reference") {
        if (!status)
          return interaction.reply({
            content:
              "❌ Custom roles are not enabled in the server! Please use /manage custom-role enable to enable.",
            flags: MessageFlags.Ephemeral,
          });

        const role = interaction.options.getRole("role", true);

        if (
          role.position > interaction.guild.members.me!.roles.highest.position
        ) {
          return interaction.reply({
            content:
              "❌ Failed to edit reference role, it's higher than my highest role.",
            flags: MessageFlags.Ephemeral,
          });
        }

        editReference(interaction.guild.id, role.id);

        return interaction.reply({ content: "✅ Reference role edited!" });
      }

      if (sub === "disable") {
        if (!status)
          return interaction.reply({
            content: "❌ Custom roles are not enabled in the server!",
            flags: MessageFlags.Ephemeral,
          });

        const customRoles = getRoles(interaction.guild.id);

        const roles = Object.keys(customRoles);

        roles.forEach(async (role) => {
          const fetched = await interaction
            .guild!.roles.fetch(role)
            .catch(() => null);

          await interaction
            .guild!.roles.delete(role)
            .catch((error) => console.error(error));
        });

        disableRoles(interaction.guild.id);

        return interaction.reply({ content: "✅ Custom roles disabled!" });
      }
    }
  },
};
