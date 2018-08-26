import * as React from "react";
import * as ReactDom from "react-dom";

import { AppFrame } from "./app-frame";

ReactDom.hydrate(
    <AppFrame />,
    document.getElementById("app"),
);
