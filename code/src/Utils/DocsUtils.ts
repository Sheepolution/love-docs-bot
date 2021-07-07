import DocsConstants from '../Constants/DocsConstants';
import IDocsLib from '../Interfaces/IDocsLib';
import IDocsLibFunction from '../Interfaces/IDocsLibFunction';

export default class DocsUtils {

    public static GetLoveUrl(name: string) {
        return DocsConstants.BASE_LOVE_DOCS_URL + name.replace('()', '');
    }

    public static GetLuaUrl(name: string) {
        return DocsConstants.BASE_LUA_DOCS_URL + name;
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