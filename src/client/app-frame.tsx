import * as React from "react";
import { Route, Switch, Link } from "react-router-dom";
import { Helmet } from "react-helmet";

import { HomePage } from "./home-page";
import { AdminFrame } from "./admin-frame";
// import { NotFoundPage } from "./not-found-page";
import { CLIENT_STATE } from "./bootstrap";

export interface Props {
}

export interface State {
}

export class AppFrame extends React.Component<Props, State> {

    public render(): JSX.Element {
        return (
            <div>
                <Helmet>
                    <html lang={CLIENT_STATE.language} />
                </Helmet>
                <main>
                    <div>
                        <Link to="/">Home</Link>
                        <Link to="/admin">Admin</Link>
                    </div>
                    <Switch>
                        <Route exact path="/" component={HomePage} />
                        <Route path="/admin" component={AdminFrame} />
                    </Switch>
                </main>
            </div>
        );
    }
}
