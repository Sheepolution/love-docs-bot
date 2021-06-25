import DocsConstants from '../Constants/DocsConstants';

export default class LoveUtils {

    public static GetLoveUrl(name: string) {
        return DocsConstants.BASE_LOVE_DOCS_URL + name.replace('()', '');
    }

    public static GetLuaUrl(name: string) {
        return DocsConstants.BASE_LUA_DOCS_URL + name;
    }
}