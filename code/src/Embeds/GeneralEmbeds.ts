import { MessageEmbed } from 'discord.js';
import CommandConstants from '../Constants/CommandConstants';
import EmojiConstants from '../Constants/EmojiConstants';
import ImageConstants from '../Constants/ImageConstants';
import SettingsConstants from '../Constants/SettingsConstants';
import IMessageInfo from '../Interfaces/IMessageInfo';
import Guild from '../Objects/Guild';
import CommandService from '../Services/CommandService';
import DiscordService from '../Services/DiscordService';

export default class GeneralEmbeds {

    public static async GetHelpEmbed(messageInfo: IMessageInfo, guild: Guild) {
        const roleId = guild.GetRoleId();
        var role;
        if (roleId != null) {
            role = await DiscordService.FindRoleById(roleId, messageInfo.guild);
        }

        const embed = new MessageEmbed()
            .setColor(SettingsConstants.COLORS.DEFAULT)
            .setTitle('Help')
            .setDescription(`${SettingsConstants.BOT_NAME} is a Discord bot for querying documentation for the LÖVE API.

Members ${role != null ? `with the role ${role.name} ` : ''}can use ${CommandService.GetCommandString(guild, CommandConstants.COMMANDS.WIKI[0], ['query'])} to query APIs from the LÖVE wiki.`);
        return embed;
    }

    public static GetDeveloperEmbed() {
        const embed = new MessageEmbed()
            .setColor(SettingsConstants.COLORS.GOOD)
            .setTitle('Developer')
            .setDescription(`${SettingsConstants.BOT_NAME} is developed by Sheepolution.

🌐 [Website](https://sheepolution.com)

🤖 [top.gg](https://top.gg/user/180335273500999680)

🐙 [Github](https://github.com/Sheepolution)

🐦 [Twitter](https://twitter.com)

🎮 [itch.io](https://sheepolution.itch.io)

📺 [Twitch](https://www.twitch.tv/sheepolution)

${EmojiConstants.HEART} [Donate](${SettingsConstants.DONATION_PAYPAL_URL})`)
            .setImage(ImageConstants.DEVELOPER.LOGO);

        return embed;
    }

    public static GetInviteEmbed() {
        const embed = new MessageEmbed()
            .setColor(SettingsConstants.COLORS.GOOD)
            .setTitle('Invite')
            .setDescription(`Invite the bot to your own server - [Link](${SettingsConstants.BOT_INVITE_URL})

Go to the support server - [Link](${SettingsConstants.SUPPORT_SERVER_INVITE_URL})`);

        return embed;

    }

    public static GetDonationEmbed() {
        const embed = new MessageEmbed()
            .setColor(SettingsConstants.COLORS.GOOD)
            .setTitle('Donate')
            .setDescription(`Thank you for using ${SettingsConstants.BOT_NAME}!
A small donation would be much appreciated!
With your support I will be able to pay for the server costs and financially support other projects. 
You can donate using the methods below:

**Patreon** - [Link](${SettingsConstants.DONATION_PATREON_URL})

**Paypal** - [Link](${SettingsConstants.DONATION_PAYPAL_URL})

**Ko-fi** - [Link](${SettingsConstants.DONATION_KOFI_URL})

**Buy me a coffee** - [Link](${SettingsConstants.DONATION_BMAC_URL})

You can also help me by [voting for the bot](https://top.gg/bot/${SettingsConstants.BOT_ID}) and writing a review.`)
            .setFooter(`Thank you ${EmojiConstants.HEART}`);

        return embed;
    }
}
