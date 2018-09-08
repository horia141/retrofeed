import * as React from "react";

import { CLIENT_CONFIG } from "./bootstrap";

export function LogoutButton() {
    return <a href={CLIENT_CONFIG.logoutPath} role="button">Logout</a>;
}
