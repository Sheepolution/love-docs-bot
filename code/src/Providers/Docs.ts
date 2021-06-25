import DocsApi from '../Data/DocsApi.json';
import IDocsApi from '../Interfaces/IDocsApi';

export default class Love {

    public static QueryApi(query: string): Array<IDocsApi> {
        const exact = DocsApi.filter(a => a.name.toLowerCase() == query.toLowerCase());
        if (exact.length == 1) {
            return exact;
        }

        return DocsApi.filter(a => a.name.toLowerCase().includes(query.toLowerCase()));
    }
}