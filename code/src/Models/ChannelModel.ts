import { Utils } from '../Utils/Utils';
import Guild from '../Objects/Guild';

const { Model } = require('objection');

export default class ChannelModel extends Model {

    static get tableName() {
        return 'channel';
    }

    public static async New(discordId: string, guild: Guild) {
        const channelId = Utils.UUID();

        const channel = await ChannelModel.query()
            .insert({
                id: channelId,
                discord_id: discordId,
                guild_id: guild.GetId(),
                creation_date: Utils.GetNowString(),
            });

        return channel;
    }

    public static async GetById(id: string) {
        const model: ChannelModel = await ChannelModel.query().findById(id);
        return model;
    }

    public static async DeleteById(id: string) {
        await ChannelModel.query().findById(id).del();
    }

    public static async GetByDiscordId(discordId: string) {
        const model: ChannelModel = await ChannelModel.query().where('discord_id', discordId).first();
        return model;
    }

    public static async GetManyByGuildId(guildId: string) {
        const model: Array<ChannelModel> = await ChannelModel.query().where('guild_id', guildId);
        return model;
    }

    public async Update(data: any, trx?: any) {
        await ChannelModel.query(trx)
            .findById(this.id)
            .patch(data);
    }
}