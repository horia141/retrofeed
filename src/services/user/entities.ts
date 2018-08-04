export enum UserState {
    Unknown = 0,
    Active = 1,
    Removed = 2,
}

export class User {
    public id: number = -1;
    public agreedToPolicy: boolean = false;
    public displayName: string = "";
    public nickname: string = "";
    public pictureUri: string = "";
    public providerId: string = "";
}
