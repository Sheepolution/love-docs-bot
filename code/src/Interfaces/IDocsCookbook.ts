export default interface IDocsCookbook {
    name: string | null;
    summary: string | null;
    guide?: {
        path: string;
        title: string;
        abstract: string | null;
        header?: {
            level: string;
            text: string;
            anchor: string;
            abstract: string | null;
        }
    }
}