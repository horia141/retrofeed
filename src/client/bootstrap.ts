import { MarshalFrom } from "raynor";
import { getNamespace } from "cls-hooked";

import { ClientConfig, ClientState } from "./shared";

const clientConfigMarshaller = new (MarshalFrom(ClientConfig))();
const clientStateMarshaller = new (MarshalFrom(ClientState))();

export let CLIENT_CONFIG: () => ClientConfig = () => new ClientConfig();
export let CLIENT_STATE: () => ClientState = () => new ClientState();

if (typeof window !== "undefined") {
    // If window is defined, we are in _client_ code, so we proceed to extract the config and state
    // from the "well known" locations written in app.hbs.
    const clientConfig = clientConfigMarshaller.extract((window as any).__RETROFEED_CLIENT_CONFIG);
    const clientState = clientStateMarshaller.extract((window as any).__RETROFEED_CLIENT_STATE);

    delete (window as any).__RETROFEED_CLIENT_CONFIG;
    delete (window as any).__RETROFEED_CLIENT_STATE;

    CLIENT_CONFIG = () => clientConfig;
    CLIENT_STATE = () => clientState;
} else {
    // If window is not defined, we are in _server_ code, doing SSR. So we proceed to extract them
    // from the per-request "store". They come in serialized again, just to keep parity with client
    // behaviour.
    CLIENT_CONFIG = () => {
        const theNamespace = getNamespace("retrofeed");
        return clientConfigMarshaller.extract(theNamespace.get("__RETROFEED_CLIENT_CONFIG"));
    };
    CLIENT_STATE = () => {
        const theNamespace = getNamespace("retrofeed");
        return clientStateMarshaller.extract(theNamespace.get("__RETROFEED_CLIENT_STATE"));
    }
}
