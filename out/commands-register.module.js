// @bun
// src/commands/Community/ping.ts
import { SlashCommandBuilder } from "./external/discord/discord.module.js";

// src/lib/ericchase/Utility/Console.ts
var newline_count = 0;
function ConsoleError(...items) {
  console["error"](...items);
  newline_count = 0;
}
function ConsoleLog(...items) {
  console["log"](...items);
  newline_count = 0;
}

// src/commands/Command.ts
async function HandleCommandError(error, interaction) {
  ConsoleError(error);
  if (interaction.isChatInputCommand()) {
    await interaction.reply({
      content: "Oops! Something went wrong while processing your request. Please try again later.",
      ephemeral: true
    });
  }
}

// src/commands/Community/ping.ts
var name = "ping";
var command_ping = {
  name,
  data: new SlashCommandBuilder().setName(name).setDescription("Replies with Pong!"),
  async execute(interaction) {
    try {
      if (interaction.isChatInputCommand()) {
        await interaction.reply("Pong!");
      } else {
        ConsoleError("unexpected", interaction);
      }
    } catch (error) {
      HandleCommandError(error, interaction);
    }
  }
};

// src/commands/Community/server-icon.ts
import { EmbedBuilder, SlashCommandBuilder as SlashCommandBuilder2 } from "./external/discord/discord.module.js";
var name2 = "servericon";
var command_server_icon = {
  name: name2,
  data: new SlashCommandBuilder2().setName(name2).setDescription("Get the Server Icon of this Server"),
  async execute(interaction) {
    try {
      if (interaction.isChatInputCommand()) {
        if (interaction.guild) {
          const icon = interaction.guild.iconURL();
          const name3 = interaction.guild.name;
          const embed = new EmbedBuilder().setColor("Green").setTitle(`${name3}'s Icon`).setImage(icon);
          await interaction.reply({ embeds: [embed] });
        }
      }
    } catch (error) {
      HandleCommandError(error, interaction);
    }
  }
};

// src/commands/Community/server-info.ts
import { EmbedBuilder as EmbedBuilder2, GuildVerificationLevel, SlashCommandBuilder as SlashCommandBuilder3 } from "./external/discord/discord.module.js";
var name3 = "serverinfo";
var command_server_info = {
  name: name3,
  data: new SlashCommandBuilder3().setName(name3).setDescription("This gets some server info"),
  async execute(interaction) {
    try {
      if (interaction.isChatInputCommand()) {
        if (interaction.guild) {
          const { guild } = interaction;
          const { memberCount, name: name4, ownerId } = guild;
          const target_user = interaction.options.getUser("user") ?? interaction.user;
          const target_member = await interaction.guild.members.fetch(target_user.id);
          const target_emojis = guild.emojis.cache.size;
          const target_icon = guild.iconURL() ?? undefined;
          const target_roles = guild.roles.cache.size;
          const embed = new EmbedBuilder2().setColor("Blue").setThumbnail(target_icon ?? null).setAuthor({ name: name4, iconURL: target_icon }).setFooter({ text: `Server ID: ${guild.id}`, iconURL: target_icon }).setTimestamp().addFields({ name: "Name", value: `${name4}`, inline: false }).addFields({ name: "Date Created", value: guild.createdAt?.toLocaleDateString() ?? "???", inline: true }).addFields({ name: "Joined", value: target_member.joinedAt?.toLocaleDateString() ?? "???", inline: true }).addFields({ name: "Server Owner", value: `<@${ownerId}>`, inline: true }).addFields({ name: "Members", value: `${memberCount}`, inline: true }).addFields({ name: "Roles", value: `${target_roles}`, inline: true }).addFields({ name: "Emojis", value: `${target_emojis}`, inline: true }).addFields({ name: "Verification Level", value: `${getGuildVerificationLevel(guild.verificationLevel)}`, inline: true }).addFields({ name: "Boosts", value: `${guild.premiumSubscriptionCount}`, inline: true });
          await interaction.reply({ embeds: [embed] });
        }
      }
    } catch (error) {
      HandleCommandError(error, interaction);
    }
  }
};
function getGuildVerificationLevel(verificationLevel) {
  switch (verificationLevel) {
    case GuildVerificationLevel.None:
      return "None";
    case GuildVerificationLevel.Low:
      return "Low";
    case GuildVerificationLevel.Medium:
      return "Medium";
    case GuildVerificationLevel.High:
      return "High";
    case GuildVerificationLevel.VeryHigh:
      return "Very High";
  }
}

// src/commands/Community/user-avatar.ts
import { EmbedBuilder as EmbedBuilder3, SlashCommandBuilder as SlashCommandBuilder4 } from "./external/discord/discord.module.js";
var name4 = "useravatar";
var command_user_avatar = {
  name: name4,
  data: new SlashCommandBuilder4().setName(name4).setDescription("Get your avatar or the Avatar from someone else").addUserOption((option) => option.setName("user").setDescription("The User you want to Avatar from").setRequired(false)),
  async execute(interaction) {
    try {
      if (interaction.isChatInputCommand()) {
        const target_user = interaction.options.getUser("user") ?? interaction.user;
        if (interaction.guild) {
          const member = await interaction.guild.members.fetch(target_user.id);
          const avatar = target_user.displayAvatarURL();
          const color = member.displayHexColor ?? "Blue";
          const Embed = new EmbedBuilder3().setColor(color).setTitle(`Here is ${target_user.username}'s Avatar`).setImage(avatar);
          await interaction.reply({ embeds: [Embed], ephemeral: false });
        } else {
          const avatar = target_user.displayAvatarURL();
          const color = "Blue";
          const Embed = new EmbedBuilder3().setColor(color).setTitle(`Here is ${target_user.username}'s Avatar`).setImage(avatar);
          await interaction.reply({ embeds: [Embed], ephemeral: false });
        }
      } else {
        ConsoleError("unexpected", interaction);
      }
    } catch (error) {
      HandleCommandError(error, interaction);
    }
  }
};

// src/commands/Community/User-Check-Troll.ts
import { SlashCommandBuilder as SlashCommandBuilder5 } from "./external/discord/discord.module.js";
import { getUsernameString } from "./lib/lib.discord.module.js";
var name5 = "userchecktroll";
var command_user_check_troll = {
  name: name5,
  data: new SlashCommandBuilder5().setName(name5).setDescription("Check if a user is a troll! <author:noob2868>").addUserOption((option) => option.setName("user").setDescription("The user to check").setRequired(true)),
  async execute(interaction) {
    try {
      if (interaction.isChatInputCommand()) {
        const target_user = interaction.options.getUser("user") ?? interaction.user;
        const target_user_string = getUsernameString(target_user);
        await interaction.reply(IsUserATroll(target_user_string));
      } else {
        ConsoleError("unexpected", interaction);
      }
    } catch (error) {
      HandleCommandError(error, interaction);
    }
  }
};
function IsUserATroll(username) {
  let a = [" is ", " is not "];
  function checkUser(user) {
    let random = a[Math.floor(Math.random() * a.length)];
    return user + random;
  }
  return `${checkUser(username)}a troll.`;
}

// src/commands/Community/user-info.ts
import { EmbedBuilder as EmbedBuilder4, SlashCommandBuilder as SlashCommandBuilder6 } from "./external/discord/discord.module.js";
var name6 = "userinfo";
var command_user_info = {
  name: name6,
  data: new SlashCommandBuilder6().setName(name6).setDescription("Get info on a user").addUserOption((option) => option.setName("user").setDescription("The user to get info on").setRequired(false)),
  async execute(interaction) {
    try {
      if (interaction.isChatInputCommand()) {
        if (interaction.guild) {
          const target_user = interaction.options.getUser("user") ?? interaction.user;
          const target_member = await interaction.guild.members.fetch(target_user.id);
          const target_icon = target_user.displayAvatarURL();
          const embed = new EmbedBuilder4().setColor("Blue").setAuthor({ name: target_user.tag, iconURL: target_icon }).setThumbnail(target_icon).addFields({ name: "User", value: `${target_user}`, inline: false }).addFields({ name: "Roles", value: `${target_member.roles.cache.map((r) => r).join(" ")}`, inline: false }).addFields({ name: "Joined Server", value: target_member.joinedAt?.toLocaleDateString() ?? "???", inline: true }).addFields({ name: "Joined Discord", value: target_user.createdAt?.toLocaleDateString() ?? "???", inline: true }).setFooter({ text: `User ID: ${target_user.id}`, iconURL: target_icon }).setTimestamp();
          await interaction.reply({ embeds: [embed] });
        }
      }
    } catch (error) {
      HandleCommandError(error, interaction);
    }
  }
};

// src/commands/Moderation/verify.ts
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder as EmbedBuilder5, PermissionsBitField, SlashCommandBuilder as SlashCommandBuilder7 } from "./external/discord/discord.module.js";
import { getGuildMember, getUsernameString as getUsernameString2 } from "./lib/lib.discord.module.js";
var verification_role_name = "Verified";
var name7 = "verify";
var command_verify = {
  name: name7,
  data: new SlashCommandBuilder7().setName(name7).setDescription("Verify a member of the server.").addUserOption((option) => option.setName("user").setDescription("The user to get info on").setRequired(true)),
  async execute(interaction) {
    try {
      if (interaction.isChatInputCommand()) {
        const guild = interaction.guild ?? undefined;
        if (guild === undefined) {
          await interaction.reply({ content: "Error: Failed to retrieve GUILD data.", ephemeral: true });
          return;
        }
        {
          const member = await getGuildMember(interaction) ?? undefined;
          if (member === undefined) {
            await interaction.reply({ content: "Error: Failed to retrieve MEMBER data.", ephemeral: true });
            return;
          }
          if (member.permissions.has(PermissionsBitField.Flags.ModerateMembers) === false) {
            await interaction.reply({ content: "Permissions Error: You must be a MODERATOR to create a verification message.", ephemeral: true });
            return;
          }
        }
        const target_user = interaction.options.getUser("user") ?? interaction.user;
        const target_member = await guild.members.fetch(target_user.id);
        const target_user_string = getUsernameString2(target_user);
        const embed = new EmbedBuilder5().setColor("Blue").setTitle("Server Verification").setDescription(`Click the button below to verify ${target_user_string} within the server.`);
        const button = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId("button").setEmoji("\u2705").setLabel("Verify").setStyle(ButtonStyle.Success));
        const reply_message = await interaction.reply({
          embeds: [embed],
          components: [button],
          fetchReply: true
        });
        const collector = reply_message.createMessageComponentCollector({});
        collector.on("collect", async (followup_interaction) => {
          const description = (() => {
            const role = guild.roles.cache.find((role2) => role2.name === verification_role_name);
            if (role) {
              target_member.roles.add(role);
              if (target_member.roles.cache.has(role.id)) {
                return `${target_user_string} is now verified!`;
              }
              return `Error: Roles for ${target_user_string} could not be updated.`;
            }
            return `Error: Failed to retrieve ROLE data. Does the role "${verification_role_name}" exist?`;
          })();
          embed.setDescription(description);
          await followup_interaction.update({ embeds: [embed], components: [] });
          collector.stop();
        });
      } else {
        ConsoleError("unexpected", interaction);
      }
    } catch (error) {
      HandleCommandError(error, interaction);
    }
  }
};

// src/commands/enabled.ts
var enabled_commands = [
  command_ping,
  command_server_icon,
  command_server_info,
  command_user_avatar,
  command_user_check_troll,
  command_user_info,
  command_verify
];
var command_name_map = new Map;
for (const command of enabled_commands) {
  command_name_map.set(command.name, command);
}

// src/commands-register.module.ts
import { Client, Events, GatewayIntentBits, REST, Routes } from "./external/discord/discord.module.js";

// src/lib/ericchase/Utility/Sleep.ts
async function Sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

// src/lib/lib.env.ts
function getVariable(key) {
  if (process.env[key] === undefined || process.env[key] === "") {
    throw new Error(`.env '${key}' is undefined`);
  }
  return process.env[key];
}
function getBotToken() {
  return getVariable("BOT_TOKEN");
}
function getClientID() {
  return getVariable("CLIENT_ID");
}

// src/commands-register.module.ts
var rest = new REST({ version: "10" }).setToken(getBotToken());
var client = new Client({ intents: [GatewayIntentBits.Guilds] });
var delay = 500;
var command_data_list = [];
for (const [_, command] of command_name_map) {
  command_data_list.push(command.data);
}
if (process.env.DEBUG === "1") {
  client.on(Events.Debug, (message) => {
    console.log("debug:", message);
  });
}
client.once(Events.ClientReady, async () => {
  try {
    ConsoleLog(`Logged in as ${client.user?.tag ?? "[APP]"}`);
    ConsoleLog(`Registering commands: [${command_data_list.map((data) => data.name).join(", ")}]`);
    const guilds = await client.guilds.fetch();
    ConsoleLog(`for ${guilds.size} guilds...`);
    for (const [_, guild] of guilds) {
      try {
        const existingCommands = await rest.get(Routes.applicationGuildCommands(getClientID(), guild.id));
        for (const command of existingCommands) {
          if (command_name_map.has(command.name) === false) {
            try {
              ConsoleLog(`Deleting command [${command.id}] for guild [${guild.id}]`);
              await rest.delete(Routes.applicationGuildCommand(getClientID(), guild.id, command.id));
              ConsoleLog("Success");
            } catch (error) {
              ConsoleError(`Error deleting command [${command.id}] for guild [${guild.id}]:`, error);
            }
            await Sleep(delay);
          }
        }
        ConsoleLog(`Registering commands for guild [${guild.id}]`);
        await rest.put(Routes.applicationGuildCommands(getClientID(), guild.id), { body: command_data_list });
        ConsoleLog("Success");
      } catch (error) {
        ConsoleError(`Error registering commands for guild [${guild.id}]:`, error);
      }
      await Sleep(delay);
    }
    ConsoleLog("Finished registering commands for all guilds!");
  } catch (error) {
    ConsoleError("Error fetching guilds:", error);
  } finally {
    client.destroy();
  }
});
client.login(getBotToken());
