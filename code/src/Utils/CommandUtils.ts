import ICommandInfo from '../Interfaces/ICommandInfo';

export default class CommandUtils {

    public static ParseContentToCommand(content: string, prefix: string) {
        const words = content.replace(/\s+/g, ' ').split(' ');
        var command = words[0].substr(prefix.length).toLowerCase();
        if (command.includes('\n')) {
            const commandSplit = words[0].substr(prefix.length).split('\n');
            command = commandSplit[0].toLowerCase();

            content = content.replace('\n', ' ');

            words.shift();
            words.unshift(commandSplit[1]);
        } else {
            words.shift();
        }

        if (content.trim().includes(' ')) {
            content = content.slice(content.indexOf(' ')).trim();
        } else {
            content = '';
        }

        const info: ICommandInfo = {
            command: command,
            commands: [],
            args: words,
            content: content,
        };

        return info;
    }

    public static GetCommaArgs(content: string) {
        const commaArgs = content.split(',');
        for (let i = 0; i < commaArgs.length; i++) {
            commaArgs[i] = commaArgs[i].trim();
        }
        return commaArgs;
    }

    public static GetNumberedArguments(content: string) {
        const obj: any = {};
        var success = false;

        const commaArgs = content.split(',');
        for (let i = 0; i < commaArgs.length; i++) {
            var arg = commaArgs[i].trim();
            var countMatch = arg.match(/^(\w+)/);
            if (countMatch) {
                success = true;
                var count = countMatch[1];
                var countNumber = parseInt(count);

                var nan = isNaN(countNumber);
                if (!nan && countNumber <= 0) {
                    continue;
                }

                if (count == 'all' || (!nan)) {
                    arg = arg.substring(count.length, arg.length).trim();
                    obj[arg] = count;
                } else {
                    obj[arg] = 1;
                }
            }
        }

        if (!success) {
            return null;
        }

        return obj;
    }

    public static GetSingleNumberedArgument(content: string) {
        const obj: any = {};

        const commaArgs = content.split(',');
        var arg = commaArgs[0].trim();
        obj.name = arg;

        var countMatch = arg.match(/^(\w+)/);
        if (countMatch) {
            var count = countMatch[1];
            var countNumber = parseInt(count);

            var nan = isNaN(countNumber);
            if (!nan && countNumber <= 0) {
                return {};
            }

            if (count == 'all' || (!nan)) {
                arg = arg.substring(count.length, arg.length).trim();
                obj.name = arg;
                obj.amount = count;
            } else {
                obj.amount = 1;
            }
        } else {
            return null;
        }

        return obj;
    }

    public static GetAssignedArguments(content: string) {
        const obj: any = {};
        var assignedArgs = (' ' + content).split(' -').slice(1);

        for (let i = 0; i < assignedArgs.length; i++) {
            const arg = assignedArgs[i].trim();

            const argumentNameMatch = arg.match(/^(\w+)/);
            if (argumentNameMatch) {
                var name = argumentNameMatch[1];
                const value = arg.substring(name.length).trim();
                obj[name] = value;
            } else {
                return null;
            }
        }

        return obj;
    }

    public static ValidateArguments(args: any) {
        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            const val = arg.value;

            if (arg.required) {
                if (val == null) {
                    return false;
                }
            }

            if (arg.numeric) {
                const n = parseInt(val);
                if (n != null && args.numeric == false) {
                    // No number
                    return false;
                } else if (n == null && args.numeric == true) {
                    return false;
                }
            }

            if (args.regex) {
                const match = val.match(arg.regex);
                if (match == null) {
                    return false;
                }
            }
        }
        return true;
    }
}