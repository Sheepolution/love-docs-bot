import LoveApi from '../Data/LoveApi.json';
import ILoveApi from '../Interfaces/ILoveApi';

export default class Love {

    public static QueryApi(query: string): Array<ILoveApi> {
        const exact = LoveApi.filter(a => a.name.toLowerCase() == query.toLowerCase());
        if (exact.length == 1) {
            return exact;
        }

        return LoveApi.filter(a => a.name.toLowerCase().includes(query.toLowerCase()));
    }
}