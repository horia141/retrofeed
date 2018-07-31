import { AuthProviderProfile } from "../../auth/auth";

export enum UserState {
    Unknown = 0,
    Active = 1,
    Removed = 2,
}

export class User {
    public id: number = -1;
    public agreedToPolicy: boolean = false;
    public profile: AuthProviderProfile = new AuthProviderProfile();
}
