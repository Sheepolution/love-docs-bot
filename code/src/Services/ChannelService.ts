import IMessageInfo from '../Interfaces/IMessageInfo';
import ChannelRepository from '../Repositories/ChannelRepository';
import GuildRepository from '../Repositories/GuildRepository';

export default class ChannelService {
    public static async CheckChannel(messageInfo: IMessageInfo) {
        const guild = await GuildRepository.GetByDiscordId(messageInfo.guild.id);
        if (guild == null) {
            return false;
        }

        const channels = await ChannelRepository.GetManyByGuildId(guild.GetId());
        if (channels.length == 0) {
            return true;
        }

        return channels.find(c => c.GetDiscordId() == messageInfo.channel.id) != null;
    }
}