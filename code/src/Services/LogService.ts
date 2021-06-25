import { TextChannel } from 'discord.js';
import { LogType } from '../Enums/LogType';
import LogModel from '../Models/LogModel';
import Guild from '../Objects/Guild';

export default class LogService {

    private static logChannel: TextChannel;

    public static async Log(logType: LogType, guild: Guild) {
        await LogModel.New(guild, logType);
    }
}