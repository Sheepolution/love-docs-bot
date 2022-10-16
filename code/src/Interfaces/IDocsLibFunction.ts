export default interface IDocsLibFunction {
    name: string;
    arguments?: string;
    description: string;
    example?: string;
    callable?: boolean;
}