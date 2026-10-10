import CommandConstants from '../Constants/CommandConstants';
import AdminEmbeds from '../Embeds/AdminEmbeds';
import IMessageInfo from '../Interfaces/IMessageInfo';
import CommandManager from '../Managers/CommandManager';
import Guild from '../Objects/Guild';
import MessageService from '../Services/MessageService';

export default class AdminHandler {

    public static OnCommand(messageInfo: IMessageInfo, guild: Guild) {
        const commands = CommandConstants.COMMANDS;
        const commandInfo = messageInfo.commandInfo;

        switch (commandInfo.commands) {
            case commands.HELP:
                this.OnHelp(messageInfo, guild);
                break;
            default: return false;
        }

        return true;
    }

    private static OnHelp(messageInfo: IMessageInfo, guild: Guild) {
        MessageService.ReplyEmbed(messageInfo, AdminEmbeds.GetHelpEmbed(guild));
        CommandManager.SetCooldown(messageInfo, 10);
    }
}