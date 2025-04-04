import DocsConstants from '../Constants/DocsConstants';
import IDocsGame from '../Interfaces/IDocsGame';
import IDocsLib from '../Interfaces/IDocsLib';
import IDocsLibFunction from '../Interfaces/IDocsLibFunction';

export default class DocsUtils {

    public static GetLoveUrl(name: string) {
        for (const part of DocsConstants.REQUIRES_URL_PARANTHESES) {
            if (name.startsWith(`${part}:`)) {
                name = name.replace(part, `(${part})`);
                break;
            }
        }

        return DocsConstants.BASE_LOVE_DOCS_URL + name.replace('()', '');
    }

    public static GetLuaUrl(name: string) {
        return DocsConstants.BASE_LUA_DOCS_URL + name;
    }

    public static GetGameUrl(game: IDocsGame) {
        return DocsConstants.BASE_GAME_DOCS_URL.replace('{1}', game.id).replace('{2}', game.slug);
    }

    public static GetLibFunctionName(lib: IDocsLib, func: IDocsLibFunction) {
        if (this.HasSeparator(func.name)) {
            return func.name;
        } else {
            return `${lib.name}${lib.callType ?? '.'}${func.name}`;
        }
    }

    public static HasSeparator(str: string) {
        return str.includes(':') || str.includes('.');
    }
}