import { EmbedBuilder } from 'discord.js';
import CommandConstants from '../Constants/CommandConstants';
import SettingsConstants from '../Constants/SettingsConstants';
import Guild from '../Objects/Guild';
import CommandService from '../Services/CommandService';

export default class AdminEmbeds {

    public static GetHelpEmbed(guild: Guild) {
        const embed = new EmbedBuilder()
            .setColor(SettingsConstants.COLORS.DEFAULT)
            .setTitle('Help')
            .setDescription(`${SettingsConstants.BOT_NAME} is a Discord bot for querying the LÖVE API.

For a list of all the commands use ${CommandService.GetCommandString(guild, CommandConstants.COMMANDS.COMMANDS[0])}.
For information about the developer use ${CommandService.GetCommandString(guild, CommandConstants.COMMANDS.DEVELOPER[0])}.

If you have a question or want to report a problem, you can contact the developer in the [support server](${SettingsConstants.SUPPORT_SERVER_INVITE_URL}).
You can use [this](${SettingsConstants.BOT_INVITE_URL}) link to add the bot to your own server.
`);
        return embed;
    }
}