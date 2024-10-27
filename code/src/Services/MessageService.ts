import DiscordService from './DiscordService';
import IMessageInfo from '../Interfaces/IMessageInfo';
import { TextChannel, PermissionFlagsBits, ChatInputCommandInteraction, MessageComponentInteraction, EmbedBuilder, ActionRowBuilder } from 'discord.js';
import EmojiConstants from '../Constants/EmojiConstants';

export default class MessageService {

    public static async ReplyMessage(messageInfo: IMessageInfo, text: string, good?: boolean, mention?: boolean, embed?: EmbedBuilder, components?: Array<ActionRowBuilder>, ephemeral: boolean = false, attachments?: Array<any>) {
        if (embed && messageInfo.guild) {
            if (!await DiscordService.CheckPermission(messageInfo, PermissionFlagsBits.EmbedLinks)) {
                return;
            }
        }

        if (good != null) {
            text = (good ? EmojiConstants.STATUS.GOOD : EmojiConstants.STATUS.BAD) + ' ' + text;
        }

        const data: any = {};

        if (text?.isFilled()) {
            data.content = text;
        }

        if (embed != null) {
            data.embeds = [embed];
        }

        if (components != null) {
            data.components = components;
        }

        if (attachments != null) {
            data.files = attachments;
        }

        if (messageInfo.interaction != null) {
            if (good == false || ephemeral) {
                data.ephemeral = true;
            }

            try {
                const interaction = messageInfo.interaction as ChatInputCommandInteraction | MessageComponentInteraction;
                if (interaction.replied) {
                    await interaction.editReply(data);
                } else if (interaction.deferred) {
                    await interaction.followUp(data);
                } else {
                    await interaction.reply(data);
                }
                if (!data.ephemeral) {
                    return await (messageInfo.interaction as ChatInputCommandInteraction | MessageComponentInteraction).fetchReply();
                }
            } catch {
                // Ignore error.
            }

            return;
        }

        if (mention) {
            return DiscordService.ReplyMessage(<TextChannel>messageInfo.channel, messageInfo.user, data);
        } else {
            return DiscordService.SendMessage(<TextChannel>messageInfo.channel, data);
        }
    }

    public static async ReplyEmbed(messageInfo: IMessageInfo, embed: EmbedBuilder, text?: string, components?: Array<ActionRowBuilder>, attachments?: Array<any>) {
        if (messageInfo.guild) {
            if (!await DiscordService.CheckPermission(messageInfo, PermissionFlagsBits.EmbedLinks)) {
                return;
            }
        }

        const data: any = { embeds: [embed] };

        if (text?.isFilled()) {
            data.content = text;
        }

        if (components != null) {
            data.components = components;
        }

        if (attachments != null) {
            data.files = attachments;
        }

        if (messageInfo.interaction != null) {
            try {
                const interaction = messageInfo.interaction as ChatInputCommandInteraction | MessageComponentInteraction;
                if (interaction.replied) {
                    await interaction.editReply(data);
                } else if (interaction.deferred) {
                    await interaction.followUp(data);
                } else {
                    await interaction.reply(data);
                }

                if (!data.ephemeral) {
                    return await (messageInfo.interaction as ChatInputCommandInteraction | MessageComponentInteraction).fetchReply();
                }
                return;
            } catch {
                // Ignore error.
            }
        }

        return await DiscordService.SendMessage(messageInfo.channel, data);
    }
}
