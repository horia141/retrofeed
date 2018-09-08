import * as React from "react";

import { CLIENT_CONFIG } from "./bootstrap";

export function LogoutButton() {
    return <a href={CLIENT_CONFIG.logoutUri} role="button">Logout</a>;
}
