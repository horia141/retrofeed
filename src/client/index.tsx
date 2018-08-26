import * as React from "react";
import * as ReactDom from "react-dom";

import { AppFrame } from "./app-frame";
import "./index.less";

ReactDom.hydrate(
    <AppFrame />,
    document.getElementById("app"),
);
