import IDocsLibFunction from './IDocsLibFunction';

export default interface IDocsLib {
    name: string;
    author: string;
    description: string;
    url: string;
    callType?: string;
    api?: Array<IDocsLibFunction>
}