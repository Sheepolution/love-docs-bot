import { Message, TextChannel } from 'discord.js';
import CommandConstants from '../Constants/CommandConstants';
import RedisConstants from '../Constants/RedisConstants';
import DocsEmbeds from '../Embeds/DocsEmbeds';
import IDocsLib from '../Interfaces/IDocsLib';
import IDocsLibFunction from '../Interfaces/IDocsLibFunction';
import IMessageInfo from '../Interfaces/IMessageInfo';
import Guild from '../Objects/Guild';
import Docs from '../Providers/Docs';
import { Redis } from '../Providers/Redis';
import ChannelService from '../Services/ChannelService';
import MessageService from '../Services/MessageService';
import { Utils } from '../Utils/Utils';

export default class DocsHandler {

    private static readonly messageKey = RedisConstants.REDIS_KEY + RedisConstants.MESSAGE_KEY;

    public static OnCommand(messageInfo: IMessageInfo, guild: Guild) {
        const commands = CommandConstants.COMMANDS;

        switch (messageInfo.commandInfo.commands) {
            case commands.WIKI:
                this.OnDocs(messageInfo, guild, messageInfo.commandInfo.content);
                break;
            case commands.LIB:
                this.OnLib(messageInfo, guild, messageInfo.commandInfo.content);
                break;
            default: return false;
        }

        return true;
    }

    private static async OnDocs(messageInfo: IMessageInfo, guild: Guild, query: string) {
        if (!await ChannelService.CheckChannel(messageInfo)) {
            return;
        }

        const roleId = guild.GetRoleId();
        if (roleId != null) {
            if (!messageInfo.member.roles.cache.some(role => role.id == roleId)) {
                return;
            }
        }

        if (!query?.isFilled()) {
            const botMessage = await MessageService.ReplyMessage(messageInfo, 'Use this command to query documentation for the LÖVE API. You can edit the message to update the bot\'s message.');

            if (botMessage != null) {
                Redis.set(this.messageKey + messageInfo.message.id, botMessage.id, 'ex', Utils.GetMinutesInSeconds(1));
            }

            return;
        }

        const docs = Docs.QueryApi(query);

        if (messageInfo.edit) {
            const oldMessageId = await Redis.get(this.messageKey + messageInfo.message.id);
            var oldMessage: Message;
            if (oldMessageId != null) {
                oldMessage = (<TextChannel>messageInfo.channel).messages.cache.get(oldMessageId);
            }
        }

        const botMessage = await MessageService.ReplyEmbed(messageInfo, DocsEmbeds.GetDocsEmbed(messageInfo, query, docs), '', oldMessage);
        if (botMessage != null) {
            Redis.set(this.messageKey + messageInfo.message.id, botMessage.id, 'ex', Utils.GetMinutesInSeconds(1));
        }
    }

    private static async OnLib(messageInfo: IMessageInfo, guild: Guild, query: string) {
        if (!await ChannelService.CheckChannel(messageInfo)) {
            return;
        }

        const roleId = guild.GetRoleId();
        if (roleId != null) {
            if (!messageInfo.member.roles.cache.some(role => role.id == roleId)) {
                return;
            }
        }

        if (!query?.isFilled()) {
            const botMessage = await MessageService.ReplyMessage(messageInfo, 'Use this command to query documentation for Lua libraries.');

            if (botMessage != null) {
                Redis.set(this.messageKey + messageInfo.message.id, botMessage.id, 'ex', Utils.GetMinutesInSeconds(1));
            }

            return;
        }

        var separator: string;
        var libraries: Array<IDocsLib>;
        var functions: Array<IDocsLibFunction>;

        if (query.includes(':')) {
            separator = ':';
        } else if (query.includes('.')) {
            separator = '.';
        } else if (query.includes(' ')) {
            separator = ' ';
        }

        if (separator?.isFilled()) {
            const func = query.substring(query.indexOf(separator) + 1);
            const library = query.slice(0, -func.length - 1);
            libraries = Docs.QueryLib(library);
            if (libraries.length > 1) {
                const botMessage = await MessageService.ReplyMessage(messageInfo, `I can't find a library named '${query}'.`, false);

                if (botMessage != null) {
                    Redis.set(this.messageKey + messageInfo.message.id, botMessage.id, 'ex', Utils.GetMinutesInSeconds(1));
                }

                return;
            }

            functions = Docs.QueryLibFunction(libraries[0], func);

        } else {
            libraries = Docs.QueryLib(query);
        }

        if (messageInfo.edit) {
            const oldMessageId = await Redis.get(this.messageKey + messageInfo.message.id);
            var oldMessage: Message;
            if (oldMessageId != null) {
                oldMessage = (<TextChannel>messageInfo.channel).messages.cache.get(oldMessageId);
            }
        }

        const botMessage = await MessageService.ReplyEmbed(messageInfo, separator?.isFilled() && libraries[0].api != null ? DocsEmbeds.GetLibFunctionEmbed(messageInfo, query, libraries[0], functions) : DocsEmbeds.GetLibEmbed(messageInfo, query, libraries), '', oldMessage);
        if (botMessage != null) {
            Redis.set(this.messageKey + messageInfo.message.id, botMessage.id, 'ex', Utils.GetMinutesInSeconds(1));
        }
    }
}