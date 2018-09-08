import * as React from "react";
import { Route, Switch, Link } from "react-router-dom";

import { HomePage } from "./home-page";
import { AdminFrame } from "./admin-frame";
// import { NotFoundPage } from "./not-found-page";

export interface Props {
}

export interface State {
}

export class AppFrame extends React.Component<Props, State> {

    public render(): JSX.Element {
        return (
            <div>
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
