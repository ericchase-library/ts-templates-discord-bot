import { ConsoleError } from 'lib/ericchase/Utility/Console.js';
import { getUsernameString } from 'lib/lib.discord.module.js';
import { HandleCommandError, type Command } from 'src/commands/Command.js';
import { SlashCommandBuilder, type Interaction } from 'src/discord/discord.module.js';

const name = 'userchecktroll';
export const command_user_check_troll: Command = {
  name,

  // Command Builder
  data: new SlashCommandBuilder() //
    .setName(name)
    .setDescription('Check if a user is a troll! <author:noob2868>')
    .addUserOption((option) => option.setName('user').setDescription('The user to check').setRequired(true)),

  // Execute Function
  async execute(interaction: Interaction) {
    try {
      if (interaction.isChatInputCommand()) {
        const target_user = interaction.options.getUser('user') ?? interaction.user;
        const target_user_string = getUsernameString(target_user);

        await interaction.reply(IsUserATroll(target_user_string));
      } else {
        ConsoleError('unexpected', interaction);
      }
    } catch (error) {
      HandleCommandError(error, interaction);
    }
  },
};

function IsUserATroll(username: string) {
  // <author:noob2868>
  let a = [' is ', ' is not '];
  function checkUser(user: string) {
    let random = a[Math.floor(Math.random() * a.length)];
    return user + random;
  }
  return `${checkUser(username)}a troll.`;
}
