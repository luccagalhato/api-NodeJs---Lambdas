export default interface IToken {

    isValid(token: string, poolRegion: string, poolUserId: string): Promise<boolean> ;

    isValidPattern(token: string): boolean;

    getValueByKeyInPayload(key: string, token: string);

    getTimeExpiration(token: string);
}