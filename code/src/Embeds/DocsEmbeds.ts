import { MessageEmbed } from 'discord.js';
import DocsConstants from '../Constants/DocsConstants';
import EmojiConstants from '../Constants/EmojiConstants';
import SettingsConstants from '../Constants/SettingsConstants';
import IDocsApi from '../Interfaces/IDocsApi';
import IDocsLib from '../Interfaces/IDocsLib';
import IDocsLibFunction from '../Interfaces/IDocsLibFunction';
import IMessageInfo from '../Interfaces/IMessageInfo';
import DocsUtils from '../Utils/DocsUtils';

export default class DocsEmbeds {

    public static GetDocsEmbed(messageInfo: IMessageInfo, query: string, apiList: Array<IDocsApi>) {

        const embed = new MessageEmbed()
            .setColor(SettingsConstants.COLORS.DEFAULT);

        if (apiList.length == 0) {
            embed.setTitle(`Search results for '${query}'`);
            embed.setDescription(`\nNo results found. ${EmojiConstants.O_FACE}`);
            embed.setFooter('You can edit your query to update this message.', messageInfo.user.displayAvatarURL());
        } else if (apiList.length == 1) {
            const api = apiList[0];
            embed.setTitle(api.name);
            embed.setURL(api.api == DocsConstants.API_NAMES.LOVE ? DocsUtils.GetLoveUrl(api.name) : DocsUtils.GetLuaUrl(api.name));
            if (api.api == DocsConstants.API_NAMES.LOVE) {
                embed.setDescription(api.description);
            } else {
                embed.setDescription(`${api.description} is part of Lua's Standard Library.`);
            }
        } else {
            embed.setTitle(`Search results for '${query}'`);
            var description = '';
            for (var i = 0; i < apiList.length; i++) {
                if (i >= 10) {
                    if (apiList.length > 12) {
                        description += `\nAnd ${apiList.length - i} more...`;
                        break;
                    }
                }

                const api = apiList[i];
                if (api.api == DocsConstants.API_NAMES.LOVE) {
                    description += `\n${EmojiConstants.BULLET.LOVE} **[${api.name}](${DocsUtils.GetLoveUrl(api.name)})**`;
                } else {
                    description += `\n${EmojiConstants.BULLET.LUA} **[${api.name}](${DocsUtils.GetLuaUrl(api.name)})**`;
                }
            }

            embed.setDescription(description);

            embed.setFooter('You can edit your query to update this message.', messageInfo.user.displayAvatarURL());
        }

        return embed;
    }

    public static GetLibEmbed(messageInfo: IMessageInfo, query: string, libList: Array<IDocsLib>) {

        const embed = new MessageEmbed()
            .setColor(SettingsConstants.COLORS.DEFAULT);

        if (libList.length == 0) {
            embed.setTitle(`Search results for '${query}'`);
            embed.setDescription(`\nNo results found. ${EmojiConstants.O_FACE}`);
            embed.setFooter('You can edit your query to update this message.', messageInfo.user.displayAvatarURL());
        } else if (libList.length == 1) {
            const lib = libList[0];
            embed.setAuthor(lib.author);
            embed.setURL(lib.url);
            embed.setTitle(lib.name);
            embed.setDescription(lib.description);
        } else {
            embed.setTitle(`Search results for '${query}'`);
            var description = '';
            for (var i = 0; i < libList.length; i++) {
                if (i >= 10) {
                    if (libList.length > 12) {
                        description += `\nAnd ${libList.length - i} more...`;
                        break;
                    }
                }

                const lib = libList[i];
                description += `\n${EmojiConstants.BULLET.LOVE} **[${lib.name}](${lib.url}})**`;
            }

            embed.setDescription(description);

            embed.setFooter('You can edit your query to update this message.', messageInfo.user.displayAvatarURL());
        }

        return embed;
    }

    public static GetLibFunctionEmbed(messageInfo: IMessageInfo, query: string, lib: IDocsLib, functionList: Array<IDocsLibFunction>) {

        const embed = new MessageEmbed()
            .setColor(SettingsConstants.COLORS.DEFAULT);
        embed.setAuthor(`${lib.name} by ${lib.author}`, null, lib.url);

        if (functionList.length == 0) {
            embed.setTitle(`Search results for '${query}'`);
            embed.setDescription(`\nNo results found. ${EmojiConstants.O_FACE}`);
            embed.setFooter('You can edit your query to update this message.', messageInfo.user.displayAvatarURL());
        } else if (functionList.length == 1) {
            const func = functionList[0];
            embed.setTitle(`${DocsUtils.GetLibFunctionName(lib, func)}${func.callable == false ? '' : `${func.arguments == null ? '()' : `( ${func.arguments} )`}`}`);
            embed.setDescription(func.description);
            if (func.example) {
                embed.addField('Example', `\`\`\`lua\n${func.example}\n\`\`\``);
            }
        } else {
            embed.setTitle(`Search results for '${query}'`);
            var description = '';
            for (var i = 0; i < functionList.length; i++) {
                if (i >= 10) {
                    if (functionList.length > 12) {
                        description += `\nAnd ${functionList.length - i} more...`;
                        break;
                    }
                }

                const func = functionList[i];
                description += `\n${EmojiConstants.BULLET.LOVE} **${DocsUtils.GetLibFunctionName(lib, func)}${func.callable == false ? '' : '()'}**`;
            }

            embed.setDescription(description);

            embed.setFooter('You can edit your query to update this message.', messageInfo.user.displayAvatarURL());
        }

        return embed;
    }
}
