import CommandHandler from '../Handlers/CommandHandler';
import IMessageInfo from '../Interfaces/IMessageInfo';
import { Message, Guild as DiscordGuild, ChannelType, ActivityType } from 'discord.js';
import DiscordUtils from '../Utils/DiscordUtils';
import GuildRepository from '../Repositories/GuildRepository';
import RedisConstants from '../Constants/RedisConstants';
import { Redis } from '../Providers/Redis';
import { Utils } from '../Utils/Utils';
import CacheManager from './CacheManager';
import SettingsConstants from '../Constants/SettingsConstants';
import Discord from '../Providers/Discord';
import LogService from '../Services/LogService';
import { LogType } from '../Enums/LogType';

export default class BotManager {

    private static readonly prefixKey = RedisConstants.REDIS_KEY + RedisConstants.GUILD_KEY + RedisConstants.PREFIX_KEY;

    public static OnReady() {
        console.log(`${SettingsConstants.BOT_NAME}: Connected`);
        BotManager.CreateActivityInterval();
        CacheManager.CreateTimeoutInterval();
    }

    public static CreateActivityInterval() {
        this.SetActivity();
        setInterval(() => {
            this.SetActivity();
        }, Utils.GetHoursInMiliSeconds(4));
    }

    public static SetActivity() {
        Discord.GetClient().user?.setActivity(`${SettingsConstants.DEFAULT_PREFIX}help`, { type: ActivityType.Watching });
    }

    public static async OnMessage(message: Message, edit?: boolean) {
        if (message.channel.type == ChannelType.DM) {
            return;
        }

        if (message.member == null) {
            return;
        }

        const messageInfo: IMessageInfo = DiscordUtils.ParseMessageToInfo(message, message.author);

        if (edit) {
            messageInfo.edit = true;
        }

        const content = message.content.trim();

        const discordGuild = messageInfo.guild;
        if (discordGuild == null) {
            return;
        }

        const loweredContent = message.content.toLowerCase();

        const guild = await GuildRepository.GetOrCreateByDiscordId(discordGuild.id);

        const prefixKey = BotManager.prefixKey + message.guild.id;
        let prefix = await Redis.get(prefixKey);
        if (prefix != null && !loweredContent.startsWith(prefix.toLowerCase())) {
            return;
        }

        prefix = guild.GetPrefix();

        Redis.set(prefixKey, prefix, 'ex', Utils.GetHoursInSeconds(1));

        if (!loweredContent.startsWith(prefix.toLowerCase())) {
            return;
        }

        CommandHandler.OnCommand(messageInfo, content, guild);
    }

    public static async OnAddedToGuild(discordGuild: DiscordGuild) {
        const guild = await GuildRepository.GetOrCreateByDiscordId(discordGuild.id);
        await guild.OnJoin();
        LogService.Log(LogType.GuildJoined, guild);
    }

    public static async OnKickedFromGuild(discordGuild: DiscordGuild) {
        const guild = await GuildRepository.GetOrCreateByDiscordId(discordGuild.id);
        await guild.OnLeave();
        LogService.Log(LogType.GuildLeft, guild);
    }

    public static async ClearPrefixCache(guildDiscordId: string) {
        const prefixKey = this.prefixKey + guildDiscordId;
        await Redis.del(prefixKey);
    }
}
