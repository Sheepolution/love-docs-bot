import CommandConstants from '../Constants/CommandConstants';
import SettingsConstants from '../Constants/SettingsConstants';
import AdminEmbeds from '../Embeds/AdminEmbeds';
import { LogType } from '../Enums/LogType';
import IMessageInfo from '../Interfaces/IMessageInfo';
import CommandManager from '../Managers/CommandManager';
import Guild from '../Objects/Guild';
import ChannelRepository from '../Repositories/ChannelRepository';
import CommandService from '../Services/CommandService';
import DiscordService from '../Services/DiscordService';
import LogService from '../Services/LogService';
import MessageService from '../Services/MessageService';

export default class AdminHandler {

    public static OnCommand(messageInfo: IMessageInfo, guild: Guild) {
        const commands = CommandConstants.COMMANDS;
        const commandInfo = messageInfo.commandInfo;

        switch (commandInfo.commands) {
            case commands.HELP:
                this.OnHelp(messageInfo, guild);
                break;
            case commands.COMMANDS:
                this.OnCommands(messageInfo, guild);
                break;
            case commands.PREFIX:
                this.OnPrefix(messageInfo, guild, commandInfo.args[0]);
                break;
            case commands.CHANNEL:
                this.OnChannel(messageInfo, guild, commandInfo.args[0]);
                break;
            case commands.ROLE:
                this.OnRole(messageInfo, guild, commandInfo.args[0]);
                break;
            default: return false;
        }

        return true;
    }

    private static OnHelp(messageInfo: IMessageInfo, guild: Guild) {
        MessageService.ReplyEmbed(messageInfo, AdminEmbeds.GetHelpEmbed(guild));
        CommandManager.SetCooldown(messageInfo, 10);
    }

    private static OnCommands(messageInfo: IMessageInfo, guild: Guild) {
        MessageService.ReplyEmbed(messageInfo, AdminEmbeds.GetCommandsEmbed(guild));
        CommandManager.SetCooldown(messageInfo, 10);
    }

    private static OnPrefix(messageInfo: IMessageInfo, guild: Guild, prefix: string) {
        if (!prefix?.isFilled()) {
            MessageService.ReplyMessage(messageInfo, 'Use this command to set the prefix for the commands.');
            return;
        }

        const maxLength = SettingsConstants.MAX_PREFIX_LENGTH;
        if (prefix.length > maxLength) {
            MessageService.ReplyMessage(messageInfo, `The prefix can't be longer than ${maxLength} characters.`, false, true);
            return;
        }

        guild.SetPrefix(prefix);

        MessageService.ReplyMessage(messageInfo, `The prefix is now set to ${prefix}`, true, true);
        CommandManager.SetCooldown(messageInfo, 10);
    }

    private static async OnChannel(messageInfo: IMessageInfo, guild: Guild, action: string) {
        if (!action?.isFilled() || action.trim().toLowerCase() == 'add') {
            var channel = await ChannelRepository.GetByDiscordId(messageInfo.channel.id);
            if (channel != null) {
                MessageService.ReplyMessage(messageInfo, 'This channel was already added.', undefined, true);
            } else {
                ChannelRepository.New(messageInfo.channel.id, guild);
                MessageService.ReplyMessage(messageInfo, 'Members can now use the bot in this channel.', true, true);
                LogService.Log(LogType.ChannelAdded, guild);
            }
        } else if (action == 'remove') {
            var channel = await ChannelRepository.GetByDiscordId(messageInfo.channel.id);
            if (channel != null) {
                ChannelRepository.Delete(channel);
                MessageService.ReplyMessage(messageInfo, 'This channel has been removed.', true, true);
                LogService.Log(LogType.ChannelRemoved, guild);
            } else {
                MessageService.ReplyMessage(messageInfo, 'This channel was not on the list already.', undefined, true);
            }
        } else {
            MessageService.ReplyMessage(messageInfo, `Use ${CommandService.GetCommandString(guild, CommandConstants.COMMANDS.CHANNEL[0], ['add/remove'], true)} to add or remove the channel as channel where members are allowed to use the bot.`, false, true);
            return;
        }

        CommandManager.SetCooldown(messageInfo, 10);
    }

    private static async OnRole(messageInfo: IMessageInfo, guild: Guild, permission: string) {
        if (!permission?.isFilled(true)) {
            MessageService.ReplyMessage(messageInfo, `Set which role is required to be allowed to use the bot. If you want no role to be required use ${CommandService.GetCommandString(guild, CommandConstants.COMMANDS.ROLE[0], ['everyone'], true)}.`, undefined, true);
            CommandManager.SetCooldown(messageInfo, 5);
            return;
        }

        permission = permission.trim().toLowerCase();

        if (permission == 'everyone') {
            await guild.SetRoleId(null);
            MessageService.ReplyMessage(messageInfo, 'All members are now allowed to use the bot.', true, true);
        } else {
            const role = await DiscordService.FindRole(permission, messageInfo.guild);
            if (role == null) {
                MessageService.ReplyMessage(messageInfo, `I can't find a role with the name ${permission}.`, false, true);
                CommandManager.SetCooldown(messageInfo, 3);
                return;
            }

            await guild.SetRoleId(role.id);
            MessageService.ReplyMessage(messageInfo, `Only members with the role ${role.name} are now allowed to use the bot.`, true, true);
        }

        CommandManager.SetCooldown(messageInfo, 10);
    }

}