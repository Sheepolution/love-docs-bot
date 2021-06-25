import { Utils } from '../Utils/Utils';
import { GuildState } from '../Enums/GuildState';

const { Model } = require('objection');

export default class GuildModel extends Model {

    static get tableName() {
        return 'guild';
    }

    public static async New(discordId: string) {
        const guildId = Utils.UUID();

        const guild = await GuildModel.query()
            .insert({
                id: guildId,
                discord_id: discordId,
                state: GuildState.Joined,
                join_date: Utils.GetNowString(),
            });

        return guild;
    }

    public static async GetById(id: string) {
        const model: GuildModel = await GuildModel.query().findById(id);
        return model;
    }

    public static async GetByDiscordId(discordId: string) {
        const model: GuildModel = await GuildModel.query().where('discord_id', discordId).first();
        return model;
    }

    public async Update(data: any, trx?: any) {
        await GuildModel.query(trx)
            .findById(this.id)
            .patch(data);
    }

    public GetState() {
        switch (this.state) {
            case '0': return GuildState.Joined;
            case '1': return GuildState.Kicked;
            default: return GuildState.Kicked;
        }
    }
}