import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  InteractionContextType,
  MessageFlags,
  ColorResolvable,
} from "discord.js";

import {
  getRole,
  mkRole,
  removeRole,
  getStatus,
  getReference,
} from "../modules/customRole";

export default {
  data: new SlashCommandBuilder()
    .setName("custom-role")
    .setDescription("Custom role commands")
    .setContexts(InteractionContextType.Guild)
    .addSubcommand((sub) =>
      sub
        .setName("make")
        .setDescription("Make your custom role")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("Name of the role")
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName("color")
            .setDescription("Color of the role, hex code (e.g. #e410d3)")
            .setRequired(true),
        ),
    )
    .addSubcommand((sub) =>
      sub
        .setName("edit")
        .setDescription("Edit your role")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("New name for the role")
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName("color")
            .setDescription("New color of the role, hex code (e.g. #e410d3)")
            .setRequired(true),
        ),
    )
    .addSubcommand((sub) =>
      sub.setName("remove").setDescription("Remove your custom role"),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) return;

    const member = await interaction.guild.members
      .fetch(interaction.user.id)
      .catch(() => null);
    if (!member) return;

    const sub = interaction.options.getSubcommand();

    const guildStatus = getStatus(interaction.guild.id);

    if (!guildStatus) {
      return interaction.reply({
        content: "❌ Custom roles are disabled!",
        flags: MessageFlags.Ephemeral,
      });
    }

    const status = getRole(interaction.guild.id, interaction.user.id);

    if (sub === "make") {
      if (status) {
        return interaction.reply({
          content:
            "❌ You already have a custom role! Use /custom-role edit to edit it!",
          flags: MessageFlags.Ephemeral,
        });
      }

      const name = interaction.options.getString("name", true);
      const color = interaction.options.getString("color", true);

      if (!color.startsWith("#")) {
        return interaction.reply({
          content:
            "❌ Invalid color format! Must start with '#'. Example: #e410d3",
          flags: MessageFlags.Ephemeral,
        });
      }

      const guildRef = await getReference(interaction.guild.id);

      const reference = await interaction.guild.roles
        .fetch(guildRef)
        .catch(() => null);

      if (!reference)
        return interaction.reply({
          content: "❌ There was an error, please try again later.",
          flags: MessageFlags.Ephemeral,
        });

      const role = await interaction.guild.roles
        .create({
          name: name,
          colors: {
            primaryColor: color as ColorResolvable,
          },
          position: reference.position - 1,
        })
        .catch((error) => {
          console.error(error);
          return interaction.reply({
            content:
              "❌ There was an error creating the role, please try again later.",
            flags: MessageFlags.Ephemeral,
          });
        });

      await member.roles.add(role.id).catch((error) => {
        console.error(error);
        return interaction.reply({
          content: "❌ Failed to give role. Please try again later.",
          flags: MessageFlags.Ephemeral,
        });
      });

      return interaction.reply({ content: "✅ Role created!" });
    }

    if (sub === "edit") {
      if (!status)
        return interaction.reply({
          content:
            "❌ You don't have a custom role yet! Please use /custom-role make to create one!",
          flags: MessageFlags.Ephemeral,
        });

      const name = interaction.options.getString("name", true);
      const color = interaction.options.getString("color", true);

      if (!color.startsWith("#"))
        return interaction.reply({
          content:
            "❌ Invalid color format! Must start with '#'. Example: #e410d3",
          flags: MessageFlags.Ephemeral,
        });

      const role = await interaction.guild.roles
        .fetch(status)
        .catch(() => null);

      if (!role) {
        removeRole(interaction.guild.id, member.id);
        return interaction.reply({
          content:
            "❌ Your role couldn't be found in the server. Make another one using /custom-role make.",
          flags: MessageFlags.Ephemeral,
        });
      }

      await role
        .edit({
          name: name,
          colors: {
            primaryColor: color as ColorResolvable,
          },
        })
        .catch((error) => {
          console.error(error);
          return interaction.reply({
            content: "❌ Failed to edit role! Please try again later!",
            flags: MessageFlags.Ephemeral,
          });
        });

      return interaction.reply({ content: "✅ Role edited!" });
    }

    if (sub === "remove") {
      if (!status)
        return interaction.reply({
          content:
            "❌ You don't have a custom role! No need to use this command!",
          flags: MessageFlags.Ephemeral,
        });

      const role = await interaction.guild.roles
        .fetch(status)
        .catch(() => null);

      if (!role) {
        removeRole(interaction.guild.id, member.id);
        return interaction.reply({ content: "✅ Role removed!" });
      }

      await interaction.guild.roles.delete(role).catch((error) => {
        console.error(error);
        return interaction.reply({
          content: "❌ Failed to delete role, please try again later.",
          flags: MessageFlags.Ephemeral,
        });
      });

      removeRole(interaction.guild.id, member.id);

      return interaction.reply({ content: "✅ Role deleted!" });
    }
  },
};
