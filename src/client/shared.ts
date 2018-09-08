import { MarshalWith, MarshalFrom, OptionalOf } from "raynor";
import * as r from "raynor";

export class User {
    @MarshalWith(r.BooleanMarshaller)
    agreedToPolicy: boolean = false;

    @MarshalWith(r.StringMarshaller)
    displayName: string = "";

    @MarshalWith(r.SecureWebUriMarshaller)
    pictureUri: string = "";
}

export class ClientConfig {
    @MarshalWith(r.StringMarshaller)
    name: string = "";

    @MarshalWith(r.StringMarshaller)
    description: string = "";

    @MarshalWith(r.SecureWebUriMarshaller)
    externalOrigin: string = "";

    @MarshalWith(r.AbsolutePathMarshaller)
    loginPath: string = "";

    @MarshalWith(r.AbsolutePathMarshaller)
    logoutPath: string = "";
}

export class ClientState {
    @MarshalWith(r.StringMarshaller)
    language: string = "";

    @MarshalWith(OptionalOf(MarshalFrom(User)))
    user: User | null = null;
}
