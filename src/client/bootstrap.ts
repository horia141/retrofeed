import { MarshalFrom } from "raynor";
import { ClientConfig, ClientState } from "./shared";

const clientConfigMarshaller = new (MarshalFrom(ClientConfig))();
const clientStateMarshaller = new (MarshalFrom(ClientState))();

export const CLIENT_CONFIG = clientConfigMarshaller.extract((window as any).__RETROFEED_CLIENT_CONFIG);
delete (window as any).__RETROFEED_CLIENT_CONFIG;

export const CLIENT_STATE = clientStateMarshaller.extract((window as any).__RETROFEED_CLIENT_STATE);
delete (window as any).__RETROFEED_CLIENT_STATE;
