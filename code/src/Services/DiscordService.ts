import { Channel, Client, Guild, GuildChannelResolvable, GuildMember, MessagePayload, PermissionFlagsBits, PermissionResolvable, Snowflake, TextChannel, User } from 'discord.js';
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

    public static async FindBotMember(guild: Guild) {
        return await DiscordService.FindMemberById(this.client.user.id, guild);
    }

    public static async FetchMembers(guild: Guild) {
        await guild.members.fetch();
        return guild.members.cache;
    }

    public static async FindMember(searchKey: string, guild: Guild) {
        const foundMember = await this.FindMemberById(searchKey, guild);
        if (foundMember) {
            return foundMember;
        }

        const lowerMember = searchKey.toLowerCase();
        guild.members.cache.find(member => {
            return member.displayName.toLowerCase() == lowerMember || member.user.username.toLowerCase() == lowerMember;
        });
    }

    public static async FindMemberById(searchKey: string, guild: Guild) {
        const id = DiscordUtils.GetMemberId(searchKey);
        if (id) {
            try {
                const foundMember = await guild.members.fetch({ user: id as Snowflake, cache: true});
                if (foundMember != null) {
                    return foundMember;
                }
            } catch {
                // Member not found
            }
        }
    }

    public static FindChannel(channelId: string, guild?: Guild) {
        const channel = this.FindChannelById(channelId, guild);

        if (channel == null && guild != null) {
            // Guild has already been fetched in FindChannelById
            return guild.channels.cache.find(channel => channel.name.toLowerCase() == channelId.toLowerCase());
        }
        return null;
    }

    public static async FindChannelById(searchKey: string, guild?: Guild) {
        const id = DiscordUtils.GetChannelId(searchKey);
        if (id) {
            let foundChannel;
            if (guild) {
                foundChannel = guild.channels.cache.get(id as Snowflake);
                if (!foundChannel) {
                    try {
                        foundChannel = await guild.channels.fetch(id as Snowflake);
                    } catch {
                        return null;
                    }
                }
            } else {
                foundChannel = this.client.channels.cache.get(id as Snowflake);
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
            return await guild.roles.fetch(id as Snowflake);
        }
    }

    public static async CreateRole(data: any, guild: Guild) {
        return guild.roles.create(data);
    }

    public static async FindMessageById(messageId: string, channel: TextChannel) {
        try {
            return await channel.messages.fetch(messageId as Snowflake);
        } catch {
            return null;
        }
    }

    public static async FindDMMessageById(messageId: string, userId: string) {
        const user = await this.FindUserById(userId);
        if (user == null) {
            return null;
        }

        try {
            const dmChannel = user.dmChannel ?? await user.createDM();
            return await dmChannel.messages.fetch(messageId as Snowflake);
        } catch (error) {
            console.log('Could not find message', error);
            return null;
        }
    }

    public static async FindUserById(userId: string) {
        try {
            return await this.client.users.fetch(userId as Snowflake);
        } catch {
            return null;
        }
    }

    public static FindGuildById(guildId: string) {
        return this.client.guilds.cache.get(guildId as Snowflake);
    }

    public static IsMemberAdmin(member: GuildMember) {
        return member.permissions.has(PermissionFlagsBits.Administrator);
    }

    public static IsMemberMod(member: GuildMember) {
        return member.permissions.has(PermissionFlagsBits.ManageChannels | PermissionFlagsBits.ManageRoles);
    }

    public static async CheckPermission(messageInfo: IMessageInfo, permission: PermissionResolvable, action?: string, sendMessage: boolean = true) {
        if (messageInfo.guild == null) {
            return;
        }

        const botMember = await DiscordService.FindBotMember(messageInfo.guild);
        const permissions = botMember.permissionsIn(messageInfo.channel as GuildChannelResolvable);
        if (permissions.has(permission)) {
            return true;
        }

        if (sendMessage) {
            MessageService.ReplyMessage(messageInfo, `I don't have permission to ${DiscordUtils.GetUserFriendlyPermissionText(permission)}${action?.isFilled() ? `, so I can't ${action}.` : '.'}`, false);
        }

        return false;
    }

    public static async SendMessage(channel: Channel, data: MessagePayload) {
        try {
            const textChannel: TextChannel = <TextChannel>channel;
            return await textChannel.send(data);
        } catch {
            // Was not able to send message.
        }
    }

    public static async ReplyMessage(textChannel: TextChannel, user: User, data: any) {
        try {
            data.content = `${user} ${data.content || ''}`;

            return await textChannel.send(data);
        } catch {
            // Was not able to send message.
        }
    }
}