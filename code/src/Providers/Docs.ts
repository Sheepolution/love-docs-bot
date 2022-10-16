import DocsApi from '../Data/DocsApi.json';
import DocsLibs from '../Data/DocsLibs.json';
import IDocsApi from '../Interfaces/IDocsApi';
import IDocsLib from '../Interfaces/IDocsLib';
import IDocsLibFunction from '../Interfaces/IDocsLibFunction';

export default class Docs {

    public static QueryApi(query: string): Array<IDocsApi> {
        const exact = DocsApi.filter(a => a.name.toLowerCase() == query.toLowerCase());
        if (exact.length == 1) {
            return exact;
        }

        return DocsApi.filter(a => a.name.toLowerCase().includes(query.toLowerCase()));
    }

    public static QueryLib(query: string): Array<IDocsLib> {
        const exact = DocsLibs.filter(a => a.name.toLowerCase() == query.toLowerCase());
        if (exact.length == 1) {
            return exact;
        }

        const like = DocsLibs.filter(a => a.name.toLowerCase().includes(query.toLowerCase()));
        return like.concat(DocsLibs.filter(a => a.description.toLowerCase().includes(query.toLowerCase()) && !like.includes(a)));
    }

    public static QueryLibFunction(lib: IDocsLib, query: string): Array<IDocsLibFunction> {
        if (lib.api == null) {
            return [];
        }

        const exactFunction = lib.api.filter(a => a.name.toLowerCase() == query.toLowerCase());
        if (exactFunction.length == 1) {
            return exactFunction;
        }

        return lib.api.filter(a => a.name.toLowerCase().includes(query.toLowerCase()));
    }
}