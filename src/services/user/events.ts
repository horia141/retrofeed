import * as r from "raynor";
import { MarshalEnum, MarshalFrom, MarshalWith, OptionalOf } from "raynor";

export enum UserEventType {
    Unknown = "Unknown",
    Created = "Created",
    Recreated = "Recreated",
    Removed = "Removed",
    AgreedToPolicy = "AgreedToPolicy",
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
