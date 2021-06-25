import RedisConstants from '../Constants/RedisConstants';
import SettingsConstants from '../Constants/SettingsConstants';
import ICooldownInfo from '../Interfaces/ICooldownInfo';
import IMessageInfo from '../Interfaces/IMessageInfo';
import ISpamInfo from '../Interfaces/ISpamInfo';
import { Redis } from '../Providers/Redis';

export default class CommandManager {

    private static readonly spamKey = RedisConstants.REDIS_KEY + RedisConstants.USER_KEY + RedisConstants.SPAM_KEY;
    private static readonly cooldownKey = RedisConstants.REDIS_KEY + RedisConstants.USER_KEY + RedisConstants.COOLDOWN_KEY;

    public static async CheckSpam(messageInfo: IMessageInfo): Promise<ISpamInfo> {
        const spamKey = this.spamKey + messageInfo.user.id;
        const total = await Redis.incr(spamKey);
        var spam = false;
        var warn = false;

        Redis.expire(spamKey, SettingsConstants.SPAM_EXPIRE_TIME);

        if (total >= 6) {
            spam = true;
            warn = total == 6;
        }

        return { spam: spam, warn: warn };
    }

    public static async GetCooldown(messageInfo: IMessageInfo): Promise<ICooldownInfo> {
        const cooldownKey = `${this.cooldownKey + messageInfo.user.id}:${messageInfo.commandInfo.command}`;

        var time = 0;
        var cooldown = await Redis.get(cooldownKey);

        if (cooldown == null) {
            return { time: 0, tell: false };
        } else {
            time = await Redis.ttl(cooldownKey);
            cooldown = parseInt(cooldown) + 1;
            Redis.set(cooldownKey, cooldown, 'ex', time);
        }

        return { time: time, tell: cooldown < 3 };
    }

    public static SetCooldown(messageInfo: IMessageInfo, time: number) {
        const cooldownKey = `${this.cooldownKey + messageInfo.user.id}:${messageInfo.commandInfo.command}`;
        Redis.set(cooldownKey, 1, 'ex', time);
    }
}