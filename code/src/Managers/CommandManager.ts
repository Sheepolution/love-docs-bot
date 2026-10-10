import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import RedisConstants from '../Constants/RedisConstants';
import SettingsConstants from '../Constants/SettingsConstants';
import ICooldownInfo from '../Interfaces/ICooldownInfo';
import IMessageInfo from '../Interfaces/IMessageInfo';
import ISpamInfo from '../Interfaces/ISpamInfo';
import Discord from '../Providers/Discord';
import { Redis } from '../Providers/Redis';

export default class CommandManager {

    private static readonly spamKey = RedisConstants.REDIS_KEY + RedisConstants.USER_KEY + RedisConstants.SPAM_KEY;
    private static readonly cooldownKey = RedisConstants.REDIS_KEY + RedisConstants.USER_KEY + RedisConstants.COOLDOWN_KEY;

    public static async CheckSpam(messageInfo: IMessageInfo): Promise<ISpamInfo> {
        const spamKey = this.spamKey + messageInfo.user.id;
        const total = await Redis.incr(spamKey);
        let spam = false;
        let warn = false;

        Redis.expire(spamKey, SettingsConstants.SPAM_EXPIRE_TIME);

        if (total >= 5) {
            spam = true;
            warn = total == 5;
        }

        return { spam: spam, warn: warn };
    }

    public static async GetCooldown(messageInfo: IMessageInfo): Promise<ICooldownInfo> {
        const cooldownKey = `${this.cooldownKey + messageInfo.user.id}:${messageInfo.commandInfo.command}`;

        let time = 0;
        let cooldown = await Redis.get(cooldownKey);

        if (cooldown == null) {
            return { time: 0, tell: false };
        } else {
            time = await Redis.ttl(cooldownKey);

            if (time == 0) {
                return { time: 0, tell: false };
            }

            cooldown = parseInt(cooldown) + 1;
            Redis.set(cooldownKey, cooldown, 'ex', time);
        }

        return { time: time, tell: cooldown < 5 };
    }

    public static SetCooldown(messageInfo: IMessageInfo, time: number) {
        const cooldownKey = `${this.cooldownKey + messageInfo.user.id}:${messageInfo.commandInfo.command}`;
        Redis.set(cooldownKey, 1, 'ex', Math.max(time, 1));
    }

    public static UpdateSlashCommands() {
        const modFlags = PermissionFlagsBits.ManageChannels | PermissionFlagsBits.ManageRoles;

        const data = [
            new SlashCommandBuilder()
                .setName('help')
                .setDescription('Get information about the bot.'),

            new SlashCommandBuilder()
                .setName('developer')
                .setDescription('Get information about the developer.'),

            new SlashCommandBuilder()
                .setName('invite')
                .setDescription('Get invite and support links.'),

            new SlashCommandBuilder()
                .setName('donate')
                .setDescription('Get donation and voting links.'),

            new SlashCommandBuilder()
                .setName('tutorial')
                .setDescription('Show LÖVE tutorial resources.'),

            new SlashCommandBuilder()
                .setName('sheep')
                .setDescription('Show the recommended beginner tutorial.'),

            new SlashCommandBuilder()
                .setName('api')
                .setDescription('Query the LÖVE API docs.')
                .addStringOption(option => option
                    .setName('query')
                    .setDescription('What to search for in the API docs.')
                    .setRequired(false)),

            new SlashCommandBuilder()
                .setName('lib')
                .setDescription('Query Lua libraries docs.')
                .addStringOption(option => option
                    .setName('query')
                    .setDescription('Library or function query (e.g. table.insert).')
                    .setRequired(false)),

            new SlashCommandBuilder()
                .setName('cookbook')
                .setDescription('Query the LÖVE cookbook.')
                .addStringOption(option => option
                    .setName('query')
                    .setDescription('Cookbook topic to search for.')
                    .setRequired(false)),

            new SlashCommandBuilder()
                .setName('game')
                .setDescription('Query games made with LÖVE.')
                .addStringOption(option => option
                    .setName('query')
                    .setDescription('Game to search for.')
                    .setRequired(false)),
        ];

        Discord.client.application?.commands.set(data);
    }
}