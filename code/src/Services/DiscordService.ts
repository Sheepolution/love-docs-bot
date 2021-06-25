import { Channel, Client, Guild, GuildMember, Message, MessageEmbed, PermissionResolvable, TextChannel, User } from 'discord.js';
import IMessageInfo from '../Interfaces/IMessageInfo';
import DiscordUtils from '../Utils/DiscordUtils';
import MessageService from './MessageService';

export default class DiscordService {

    private static client: Client;

    public static SetClient(client: Client) {
        if (this.client != null) {
            throw new Error('Client can only be set once.');
        }

        this.client = client;
    }

    public static async FindMember(searchKey: string, guild: Guild) {
        const foundMember = await this.FindMemberById(searchKey, guild);
        if (foundMember) {
            return foundMember;
        }

        await guild.members.fetch();

        const lowerMember = searchKey.toLowerCase();
        return guild.members.cache.find(member => {
            return member.displayName.toLowerCase() == lowerMember || member.user.username.toLowerCase() == lowerMember;
        });
    }

    public static async FindMemberById(searchKey: string, guild: Guild) {
        const id = DiscordUtils.GetMemberId(searchKey);
        if (id) {
            const foundMember = await guild.members.fetch(id);
            if (foundMember != null) {
                return foundMember;
            }
        }
    }

    public static FindAllChannels(guild: Guild) {
        return guild.channels.cache.array();
    }

    public static FindChannel(channelId: string, guild?: Guild) {
        var channel = this.FindChannelById(channelId, guild);

        if (channel == null && guild != null) {
            // Guild has already been fetched in FindChannelById
            return guild.channels.cache.find(channel => channel.name.toLowerCase() == channelId.toLowerCase());
        }
        return null;
    }

    public static async FindChannelById(searchKey: string, guild?: Guild) {
        const id = DiscordUtils.GetChannelId(searchKey);
        if (id) {
            var foundChannel;
            if (guild) {
                foundChannel = guild.channels.cache.get(id);
                if (!foundChannel) {
                    await guild.fetch();
                    foundChannel = guild.channels.cache.get(id);
                }
            } else {
                foundChannel = await this.client.channels.fetch(id);
            }

            if (foundChannel != null) {
                return foundChannel;
            }
        }
    }

    public static async FindRole(searchKey: string, guild: Guild) {
        const foundRole = await this.FindRoleById(searchKey, guild);
        if (foundRole) {
            return foundRole;
        }

        await guild.roles.fetch();

        const lowerRole = searchKey.toLowerCase();
        return guild.roles.cache.find(role => role.name.toLowerCase() == lowerRole);
    }

    public static async FindRoleById(searchKey: string, guild: Guild) {
        const id = DiscordUtils.GetRoleId(searchKey);
        if (id) {
            return await guild.roles.fetch(id);
        }
    }

    public static async CreateRole(data: any, guild: Guild) {
        return guild.roles.create({ data: data });
    }

    public static async FindMessageById(messageId: string, channel: TextChannel) {
        try {
            return await channel.messages.fetch(messageId);
        } catch (error) {
            return null;
        }
    }

    public static async FindUserById(userId: string) {
        try {
            return await this.client.users.fetch(userId);
        } catch (error) {
            return null;
        }
    }

    public static async FindGuildById(guildId: string) {
        return await this.client.guilds.fetch(guildId, true);
    }

    public static IsMemberAdmin(member: GuildMember) {
        return member.hasPermission('ADMINISTRATOR');
    }

    public static IsMemberMod(member: GuildMember) {
        return member.hasPermission('MANAGE_CHANNELS') || member.hasPermission('MANAGE_MESSAGES') || member.hasPermission('MANAGE_ROLES');
    }

    public static async CheckPermission(messageInfo: IMessageInfo, permission: PermissionResolvable, action?: string, sendMessage: boolean = true) {
        const botMember = await DiscordService.FindMemberById(this.client.user.id, messageInfo.guild);
        const permissions = botMember.permissionsIn(messageInfo.channel);
        if (permissions.has(permission)) {
            return true;
        }

        if (sendMessage) {
            MessageService.ReplyMessage(messageInfo, `I don't have permission to ${DiscordUtils.GetUserFriendlyPermissionText(permission)}${action?.isFilled() ? `, so I can't ${action}.` : '.'}`, false);
        }

        return false;
    }

    public static async SendEmbed(channel: Channel, embed: MessageEmbed, content?: string) {
        try {
            const textChannel: TextChannel = <TextChannel>channel;
            return await (content ? textChannel.send(content, embed) : textChannel.send(embed));
        } catch (error) {
            // Was not able to send message.
        }
    }

    public static async SendMessage(channel: Channel, message: string, embed?: MessageEmbed) {
        try {
            const textChannel: TextChannel = <TextChannel>channel;
            if (embed) {
                return await this.SendEmbed(textChannel, embed, message);
            }

            return await textChannel.send(message);
        } catch (error) {
            // Was not able to send message.
        }
    }

    public static async ReplyMessage(textChannel: TextChannel, user: User, message: string, embed?: MessageEmbed) {
        try {
            const reply = `<@${user}> ${message}`;

            if (embed) {
                return await this.SendEmbed(textChannel, embed, reply);
            }

            return await textChannel.send(reply);
        } catch (error) {
            // Was not able to send message.
        }
    }

    public static async EditMessage(oldMessage: Message, message: string, user?: User, embed?: MessageEmbed) {
        try {
            if (user != null) {
                message = `<@${user}> ${message}`;
            }

            if (embed) {
                return await this.EditEmbed(oldMessage, embed, message);
            }

            return await oldMessage.edit(message);
        } catch (error) {
            // Was not able to send message.
        }
    }

    public static async EditEmbed(oldMessage: Message, embed: MessageEmbed, content?: string) {
        return await (content?.isFilled() ? oldMessage.edit(content, embed) : oldMessage.edit(embed));
    }
}