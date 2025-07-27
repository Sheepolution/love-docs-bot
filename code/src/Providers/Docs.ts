import DocsApi from '../Data/DocsApi.json';
import DocsLibs from '../Data/DocsLibs.json';
import DocsCookbook from '../Data/DocsCookBook.json';
import DocsGames from '../Data/DocsGames.json';
import IDocsApi from '../Interfaces/IDocsApi';
import IDocsLib from '../Interfaces/IDocsLib';
import IDocsLibFunction from '../Interfaces/IDocsLibFunction';
import IDocsCookbook from '../Interfaces/IDocsCookbook';
import IDocsGame from '../Interfaces/IDocsGame';
import DocsUtils from '../Utils/DocsUtils';

export default class Docs {

    public static QueryApi(query: string): Array<IDocsApi> {
        const exact = DocsApi.filter(a => a.name.toLowerCase() == query.toLowerCase());
        if (exact.length == 1) {
            return exact;
        }

        return DocsApi.filter(a => a.name.toLowerCase().includes(query.toLowerCase()));
    }

    public static QueryLib(query: string): Array<IDocsLib> {

        const normQuery = DocsUtils.Normalize(query);

        const exact = DocsLibs.filter(a => DocsUtils.Normalize(a.name) == normQuery);
        if (exact.length == 1) {
            return exact;
        }

        const like = DocsLibs.filter(a => DocsUtils.Normalize(a.name).includes(normQuery));
        return like.concat(
            DocsLibs.filter(
                a => DocsUtils.Normalize(a.description).includes(normQuery) && !like.includes(a)
            )
        );
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

    public static QueryCookbook(query: string): IDocsCookbook {
        const queryLower = query.toLowerCase();

        const cbGroup: IDocsCookbook = {
            name: null,
            summary: null,
        };

        // Exact search the groups
        const matchingGroup = DocsCookbook.find(a => a.name?.toLowerCase() == queryLower);
        if (matchingGroup) {
            cbGroup.name = matchingGroup.name;
            cbGroup.summary = matchingGroup.summary ?? matchingGroup?.guides[0]?.path;
            return cbGroup;
        }

        // Exact search the guides
        for (const group of DocsCookbook) {
            const guide = group.guides.find(g => g.title.toLowerCase() == queryLower);
            if (guide) {
                cbGroup.name = group.name;
                cbGroup.summary = group.summary;
                cbGroup.guide = { ...guide };
                return cbGroup;
            }
        }

        // Exact search the headers
        for (const group of DocsCookbook) {
            for (const guide of group.guides) {
                const header = guide.headers?.find(h => h.text.toLowerCase() == queryLower);
                if (header) {
                    cbGroup.name = group.name;
                    cbGroup.summary = group.summary;
                    cbGroup.guide = {
                        ...guide,
                        header: { ...header }
                    };
                    return cbGroup;
                }
            }
        }

        // Fuzzy search the guides
        for (const group of DocsCookbook) {
            const guide = group.guides.find(g => g.title.toLowerCase().includes(queryLower));
            if (guide) {
                cbGroup.name = group.name;
                cbGroup.summary = group.summary;
                cbGroup.guide = { ...guide };
                return cbGroup;
            }
        }

        // Fuzzy search the headers
        for (const group of DocsCookbook) {
            for (const guide of group.guides) {
                const header = guide.headers?.find(h => h.text.toLowerCase().includes(queryLower));
                if (header) {
                    cbGroup.name = group.name;
                    cbGroup.summary = group.summary;
                    cbGroup.guide = {
                        ...guide,
                        header: { ...header }
                    };
                    return cbGroup;
                }
            }
        }

        return null;
    }

    public static QueryGames(query: string): Array<IDocsGame> {
        const exact = DocsGames.filter(a => a.title.toLowerCase() == query.toLowerCase());
        if (exact.length == 1) {
            return exact;
        }

        return DocsGames.filter(a => a.title.toLowerCase().includes(query.toLowerCase()));
    }
}