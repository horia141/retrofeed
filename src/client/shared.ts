import { MarshalWith, MarshalFrom, OptionalOf } from "raynor";
import * as r from "raynor";

export class User {
    @MarshalWith(r.BooleanMarshaller)
    public agreedToPolicy: boolean = false;

    @MarshalWith(r.StringMarshaller)
    public displayName: string = "";

    @MarshalWith(r.SecureWebUriMarshaller)
    public pictureUri: string = "";
}

export class ClientConfig {
    @MarshalWith(r.StringMarshaller)
    name: string = "";

    @MarshalWith(r.StringMarshaller)
    description: string = "";

    @MarshalWith(r.SecureWebUriMarshaller)
    externalOrigin: string = "";

    @MarshalWith(r.WebUriMarshaller)
    public loginUri: string = "";
}

export class ClientState {
    @MarshalWith(r.StringMarshaller)
    language: string = "";

    @MarshalWith(OptionalOf(MarshalFrom(User)))
    user: User | null = null;
}
