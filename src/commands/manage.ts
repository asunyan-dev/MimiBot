import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  InteractionContextType,
  PermissionFlagsBits,
  MessageFlags,
  EmbedBuilder,
  ActionRowBuilder,
  ChannelSelectMenuBuilder,
  ComponentType
} from "discord.js";

import {
  enableRoles,
  editReference,
  disableRoles,
  getRoles,
  getStatus,
} from "../modules/customRole";

import { enableWarn, disableWarn, getWarningStatus, clearWarnings, getWarnings } from "../modules/warning";


import { enableLog, editLog, disableLog, getAll, getLog } from "../modules/logs"


import { ignoreChannel, unignoreChannel, ignoreUser, unignoreUser, getAllChannels, getAllUsers, getChannel, getUser } from "../modules/logIgnore"

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
    )
    .addSubcommandGroup((group) => 
      group
        .setName("warnings")
        .setDescription("Manage warnings")
        .addSubcommand((sub) => 
          sub
            .setName("enable")
            .setDescription("Enable Warnings for the server")
        )
        .addSubcommand((sub) => 
          sub
            .setName("disable")
            .setDescription("Disable warnings for the server")
        )
        .addSubcommand((sub) => 
          sub
            .setName("clear-warnings")
            .setDescription("Clear warnings for a user.")
            .addUserOption((option) => 
              option
                .setName("user")
                .setDescription("User to clear warnings for")
                .setRequired(true)
            )
        )
    )
    .addSubcommandGroup((group) => 
      group
        .setName("logs")
        .setDescription("Manage logs in your server.")
        .addSubcommand((sub) => 
          sub
            .setName("enable")
            .setDescription("Enable a type of log.")
            .addStringOption((option) => 
              option
                .setName("type")
                .setDescription("Type of logs to enable.")
                .setRequired(true)
                .addChoices(
                  { name: "Member Events", value: "memberEvents" },
                  { name: "Message Logs", value: "messageLogs" },
                  { name: "Join / Leave", value: "joinLeave" },
                  { name: "Voice Logs", value: "voiceLogs" }
                )
            )
        )
        .addSubcommand((sub) => 
          sub
            .setName("edit")
            .setDescription("Edit channel for a log")
            .addStringOption((option) => 
              option
                .setName("type")
                .setDescription("The logs you want to edit channel for")
                .setRequired(true)
                .addChoices(
                  { name: "Member Events", value: "memberEvents" },
                  { name: "Message Logs", value: "messageLogs" },
                  { name: "Join / Leave", value: "joinLeave" },
                  { name: "Voice Logs", value: "voiceLogs" }
                )
            )
        )
        .addSubcommand((sub) => 
          sub
            .setName("disable")
            .setDescription("Disable a type of logs")
            .addStringOption((option) => 
              option
                .setName("type")
                .setDescription("Type of log to disable")
                .setRequired(true)
                .addChoices(
                  { name: "Member Events", value: "memberEvents" },
                  { name: "Message Logs", value: "messageLogs" },
                  { name: "Join / Leave", value: "joinLeave" },
                  { name: "Voice Logs", value: "voiceLogs" }
                )
            )        
        )
        .addSubcommand((sub) => 
          sub
            .setName("get-config")
            .setDescription("Get the logs configuration for this server.")
        )
    )
    .addSubcommandGroup((group) => 
      group
        .setName("log-ignore")
        .setDescription("Ignore / Unignore logs for a user or a channel")
        .addSubcommand((sub) => 
          sub
            .setName("user")
            .setDescription("Ignore/Unignore logs for a user")
            .addUserOption((option) => 
              option
                .setName("user")
                .setDescription("User to ignore/unignore")
                .setRequired(true)
            )
        )
        .addSubcommand((sub) => 
          sub
            .setName("channel")
            .setDescription("Ignore/Unignore logs for a channel")
            .addChannelOption((option) => 
              option
                .setName("channel")
                .setDescription("Channel to ignore/unignore")
                .setRequired(true)
            )
        )
        .addSubcommand((sub) => 
          sub
            .setName("get")
            .setDescription("Get list of ignored channels/users")
        )
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) return;
    const group = interaction.options.getSubcommandGroup();
    const sub = interaction.options.getSubcommand();

    

    if (group === "custom-role") {
      const status = getStatus(interaction.guild.id);
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
    };

    if(group === "warnings") {
      const status = await getWarningStatus(interaction.guild.id);

      if(sub === "enable") {
        if(status.enabled) return interaction.reply({content: "❌ Warnings are already enabled for the server!", flags: MessageFlags.Ephemeral});

        enableWarn(interaction.guild.id);

        return interaction.reply({content: "✅ Warnings enabled for the server!"});
      };

      if(sub === "disable") {
        if(!status.enabled) return interaction.reply({content: "❌ Warnings were not enabled for this server!", flags: MessageFlags.Ephemeral});

        disableWarn(interaction.guild.id);

        return interaction.reply({content: "✅ Warnings disabled for the server."});
      };


      if(sub === "clear-warnings") {
        if(!status.enabled) return interaction.reply({content: "❌ Warnings are not enabled on this server.", flags: MessageFlags.Ephemeral});

        const user = interaction.options.getUser("user", true);

        const warnings = await getWarnings(interaction.guild.id, user.id);

        if(warnings.length === 0) {
          return interaction.reply({content: "❌ This member had no warnings.", flags: MessageFlags.Ephemeral});
        };

        clearWarnings(interaction.guild.id, user.id);

        return interaction.reply({content: "✅ Cleared warnings for " + user.displayName + "."});
      }
    };


    if(group === "logs") {


      if(sub === "enable") {
        const log = interaction.options.getString("type", true);

        const status = await getLog(interaction.guild.id, log);

        if(status.enabled) return interaction.reply({content: "❌ This type of logs is already enabled!\nℹ️ Want to edit the channel for this type? Type /manage logs edit!", flags: MessageFlags.Ephemeral});

        const embed = new EmbedBuilder()
          .setTitle("Log Configuration")
          .setDescription("Please select below the channel to post logs for this type.")
          .setColor(0xe410d3);

        const row = new ActionRowBuilder().addComponents(
          new ChannelSelectMenuBuilder()
            .setCustomId("channel")
            .setPlaceholder("Select a channel here...")
            .setRequired(true)
        ).toJSON();


        const reply = await interaction.reply({embeds: [embed], components: [row]});

        const collector = reply.createMessageComponentCollector({
          componentType: ComponentType.ChannelSelect,
          time: 60_000
        });


        collector.on("collect", async (i) => {
          if(i.user.id !== interaction.user.id) return interaction.reply({content: "❌ This menu is not for you!", flags: MessageFlags.Ephemeral});

          if(i.customId === "channel") {
            const channel = i.channels.first();
            if(!channel) return;

            enableLog(interaction.guild!.id, log, channel.id);

            const embed2 = new EmbedBuilder()
              .setTitle("✅ Log Type configured!")
              .setDescription(`Logs will be sent to <#${channel.id}>.`)
              .setColor(0xe410d3);

            return i.update({embeds: [embed2], components: []});
          }
        });

        collector.on("end", async () => {
          try {
            interaction.followUp({components: []})
          } catch {};
        });
      };


      if(sub === "edit") {
        const log = interaction.options.getString("type", true);

        const status = await getLog(interaction.guild.id, log);

        if(!status.enabled) return interaction.reply({content: "❌ This type of logs is not enabled! Please use /manage logs enable to enable it.", flags: MessageFlags.Ephemeral});

        const embed = new EmbedBuilder()
          .setTitle("Log Editing")
          .setDescription("Select a channel below to set it as new log channel for this type.")
          .setColor(0xe410d3);

        const row = new ActionRowBuilder().addComponents(
          new ChannelSelectMenuBuilder()
            .setCustomId("channel")
            .setPlaceholder("Select a channel...")
            .setRequired(true)
        ).toJSON();

        const reply = await interaction.reply({embeds: [embed], components: [row]});

        const collector = reply.createMessageComponentCollector({
          componentType: ComponentType.ChannelSelect,
          time: 60_000
        });

        collector.on("collect", async (i) => {
          if(i.user.id !== interaction.user.id) return interaction.reply({content: "❌ This menu is not for you!", flags: MessageFlags.Ephemeral});

          const channel = i.channels.first();
          if(!channel) return;

          editLog(interaction.guild!.id, log, channel.id);

          const embed2 = new EmbedBuilder()
            .setTitle("✅ Log edited!")
            .setDescription(`Logs will now be sent to <#${channel.id}>.`)
            .setColor(0xe410d3);

          return i.update({embeds: [embed2], components: []});
        });

        collector.on("end", async () => {
          try {
            interaction.followUp({components: []});
          } catch {};
        });
      };


      if(sub === "disable") {
        const log = interaction.options.getString("type", true);

        const status = await getLog(interaction.guild.id, log);
        if(!status.enabled) return interaction.reply({content: "❌ This type of logs is not enabled, no need to use this command!", flags: MessageFlags.Ephemeral});

        disableLog(interaction.guild.id, log);

        return interaction.reply({content: "✅ Logs disabled for this type."});
      };


      if(sub === "get-config") {
        const all = await getAll(interaction.guild.id);

        const embed = new EmbedBuilder()
          .setTitle(`Logs Config for ${interaction.guild.name}`)
          .setThumbnail(interaction.guild.iconURL({size: 512}))
          .setColor(0xe410d3)
          .setDescription(`**Member Events:**\nEnabled: ${all.memberEvents.enabled ? "✅" : "❌"}\nChannel: ${all.memberEvents.channelId ? `<#${all.memberEvents.channelId}>` : "N/A"}\n\n**Message Logs:**\nEnabled: ${all.messageLogs.enabled ? "✅" : "❌"}\nChannel: ${all.messageLogs.channelId ? `<#${all.messageLogs.channelId}>` : "N/A"}\n\n**Join / Leave:**\nEnabled: ${all.joinLeave.enabled ? "✅" : "❌"}\nChannel: ${all.joinLeave.channelId ? `<#${all.joinLeave.channelId}>` : "N/A"}\n\n**Voice Logs:**\nEnabled: ${all.voiceLogs.enabled ? "✅" : "❌"}\nChannel: ${all.voiceLogs.channelId ? `<#${all.voiceLogs.channelId}>` : "N/A"}`)
          .setTimestamp();

        return interaction.reply({embeds: [embed]});
      }
    };


    if(group === "log-ignore") {

      if(sub === "user") {
        const user = interaction.options.getUser("user", true);

        const status = await getUser(interaction.guild.id, user.id);

        if(!status) {
          ignoreUser(interaction.guild.id, user.id);
          return interaction.reply({content: "✅ User ignored."});
        } else {
          unignoreUser(interaction.guild.id, user.id);
          return interaction.reply({content: "✅ User unignored."});
        }
      };

      if(sub === "channel") {
        const channel = interaction.options.getChannel("channel", true);

        const status = getChannel(interaction.guild.id, channel.id);

        if(!status) {
          ignoreChannel(interaction.guild.id, channel.id);
          return interaction.reply({content: "✅ Channel ignored."});
        } else {
          unignoreChannel(interaction.guild.id, channel.id);
          return interaction.reply({content: "✅ Channel unignored."});
        };
      };

      if(sub === "get") {
        const allUsers = await getAllUsers(interaction.guild.id);
        const allChannels = await getAllChannels(interaction.guild.id);

        const users = Object.keys(allUsers);
        const channels = Object.keys(allChannels);

        const userEmbed = new EmbedBuilder()
          .setTitle("Ignored Users")
          .setColor(0xe410d3)
          .setDescription(`- ${users.map(user => `<@${user}>`).join("\n- ")}`)
          .setTimestamp();

        const channelEmbed = new EmbedBuilder()
          .setTitle("Ignored Channels")
          .setColor(0xe410d3)
          .setDescription(`- ${channels.map(channel => `<#${channel}>`).join("\n- ")}`)
          .setTimestamp();


        return interaction.reply({embeds: [userEmbed, channelEmbed]});

      }

    }

  },
};
