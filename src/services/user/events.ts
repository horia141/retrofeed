import * as r from "raynor";
import { MarshalEnum, MarshalFrom, MarshalWith, OptionalOf } from "raynor";

export enum UserEventType {
    Unknown = 0,
    Created = 1,
    Recreated = 2,
    Removed = 3,
    AgreedToPolicy = 4,
}

export class UserCreationData {
    @MarshalWith(r.BooleanMarshaller)
    public agreedToPolicy: boolean = false;

    @MarshalWith(r.StringMarshaller)
    public displayName: string = "";

    @MarshalWith(r.StringMarshaller)
    public nickname: string = "";

    @MarshalWith(r.SecureWebUriMarshaller)
    public pictureUri: string = "";
}

export class UserEvent {
    @MarshalWith(MarshalEnum(UserEventType))
    public type: UserEventType = UserEventType.Unknown;

    @MarshalWith(r.DateFromTsMarshaller)
    public timestamp: Date = new Date();

    @MarshalWith(OptionalOf(MarshalFrom(UserCreationData)))
    public data: UserCreationData|null = null;
}
