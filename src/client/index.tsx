import * as React from "react";
import * as ReactDom from "react-dom";
import { BrowserRouter } from "react-router-dom";

import { AppFrame } from "./app-frame";
import "./index.less";

ReactDom.hydrate(
    <BrowserRouter>
        <AppFrame />
    </BrowserRouter>,
    document.getElementById("app"),
);
