import { LogType } from '../Enums/LogType';
import LogModel from '../Models/LogModel';
import Guild from '../Objects/Guild';

export default class LogService {

    public static async Log(logType: LogType, guild: Guild) {
        await LogModel.New(guild, logType);
    }
}