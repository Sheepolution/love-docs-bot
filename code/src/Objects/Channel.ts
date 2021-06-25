import ChannelModel from '../Models/ChannelModel';
import GuildRepository from '../Repositories/GuildRepository';

export default class Channel {

    private model: ChannelModel;
    private id: string;
    private discordId: string;
    private guildId: string;

    public ApplyModel(model: ChannelModel) {
        this.model = model;
        this.id = model.id;
        this.discordId = model.discord_id;
        this.guildId = model.guild_id;
    }

    public GetId() {
        return this.id;
    }

    public GetDiscordId() {
        return this.discordId;
    }

    public GetGuildId() {
        return this.guildId;
    }

    public GetGuild() {
        return GuildRepository.GetById(this.guildId);
    }
}