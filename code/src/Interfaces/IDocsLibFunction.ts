export default interface IDocsError {
    name: string;
    arguments?: string;
    description: string;
    example?: string;
    callable?: boolean;
}