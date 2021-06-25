import SettingsConstants from '../Constants/SettingsConstants';
import CacheManager from '../Managers/CacheManager';
import ChannelModel from '../Models/ChannelModel';
import Channel from '../Objects/Channel';
import Guild from '../Objects/Guild';

export default class ChannelRepository {

    public static async New(discordId: string, guild: Guild) {
        const channel = this.Make(await ChannelModel.New(discordId, guild));
        CacheManager.Set(channel, ChannelRepository, ChannelModel.GetByDiscordId, [discordId], SettingsConstants.CACHE_TIMEOUT_DEFAULT);
        this.ClearManyByGuildId(guild.GetId());
        return channel;
    }

    public static Make(model: ChannelModel) {
        const channel = new Channel();
        channel.ApplyModel(model);
        return channel;
    }

    public static Delete(channel: Channel) {
        ChannelModel.DeleteById(channel.GetId());
        this.ClearById(channel.GetId());
        this.ClearByDiscordId(channel.GetDiscordId());
        this.ClearManyByGuildId(channel.GetGuildId());
    }

    public static async GetByDiscordId(discordId: string) {
        const channel = await CacheManager.Get(ChannelRepository, ChannelModel.GetByDiscordId, [discordId], SettingsConstants.CACHE_TIMEOUT_DEFAULT);
        return channel;
    }

    public static async GetManyByGuildId(guildId: string) {
        const channel = await CacheManager.GetMany(ChannelRepository, ChannelModel.GetManyByGuildId, [guildId], SettingsConstants.CACHE_TIMEOUT_DEFAULT);
        return channel;
    }

    public static ClearById(id: string) {
        CacheManager.Clear(ChannelRepository, ChannelModel.GetById, [id]);
    }

    public static ClearByDiscordId(discordId: string) {
        CacheManager.Clear(ChannelRepository, ChannelModel.GetByDiscordId, [discordId]);
    }

    public static ClearManyByGuildId(guildId: string) {
        CacheManager.Clear(ChannelRepository, ChannelModel.GetManyByGuildId, [guildId]);
    }
}