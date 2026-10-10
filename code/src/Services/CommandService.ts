import Guild from '../Objects/Guild';

export default class CommandService {

    public static GetCommandString(guild?: Guild, command?: string, args?: Array<string>, asValues?: boolean) {
        if (command == null) { return ''; }

        let str = `\`/${command}`;
        if (args != null) {
            for (const arg of args) {
                str += asValues ? ` ${arg}` : ` [${arg}]`;
            }
        }

        return `${str}\``;
    }
}