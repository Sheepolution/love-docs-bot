import SettingsConstants from '../Constants/SettingsConstants';
import CacheManager from '../Managers/CacheManager';
import GuildModel from '../Models/GuildModel';
import Guild from '../Objects/Guild';

export default class GuildRepository {

    public static async New(discordId: string) {
        const guild = this.Make(await GuildModel.New(discordId));
        CacheManager.Set(guild, GuildRepository, GuildModel.GetByDiscordId, [discordId], SettingsConstants.CACHE_TIMEOUT_DEFAULT);
        return guild;
    }

    public static Make(model: GuildModel) {
        const guild = new Guild();
        guild.ApplyModel(model);
        return guild;
    }

    public static async GetById(guildId: string) {
        const event = await CacheManager.Get(GuildRepository, GuildModel.GetById, [guildId], SettingsConstants.CACHE_TIMEOUT_DEFAULT);
        const eventByDiscordId = await this.GetByDiscordId(event.GetDiscordId());
        return eventByDiscordId;
    }

    public static async GetOrCreateByDiscordId(discordId: string) {
        var guild = await this.GetByDiscordId(discordId);

        if (guild == null) {
            guild = await this.New(discordId);
        }

        return guild;
    }

    public static async GetByDiscordId(discordId: string) {
        const guild = await CacheManager.Get(GuildRepository, GuildModel.GetByDiscordId, [discordId], SettingsConstants.CACHE_TIMEOUT_DEFAULT);
        return guild;
    }
}