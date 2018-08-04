export enum UserState {
    Unknown = "Unknown",
    Active = "Active",
    Removed = "Removed",
}

export class User {
    public id: number = -1;
    public agreedToPolicy: boolean = false;
    public displayName: string = "";
    public nickname: string = "";
    public pictureUri: string = "";
    public providerId: string = "";
}
