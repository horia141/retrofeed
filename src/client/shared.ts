import * as r from "raynor";
import { MarshalFrom, MarshalWith, OptionalOf } from "raynor";

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
    public name: string = "";

    @MarshalWith(r.StringMarshaller)
    public description: string = "";

    @MarshalWith(r.SecureWebUriMarshaller)
    public externalOrigin: string = "";

    @MarshalWith(r.AbsolutePathMarshaller)
    public loginPath: string = "";

    @MarshalWith(r.AbsolutePathMarshaller)
    public logoutPath: string = "";

    @MarshalWith(r.SecureWebUriMarshaller)
    public logoUri: string = "";

    @MarshalWith(r.StringMarshaller)
    public facebookAppId: string = "";

    @MarshalWith(r.StringMarshaller)
    public twitterHandle: string = "";
}

export class ClientState {
    @MarshalWith(r.StringMarshaller)
    public language: string = "";

    @MarshalWith(OptionalOf(MarshalFrom(User)))
    public user: User | null = null;
}
