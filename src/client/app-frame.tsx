import * as React from "react";
import { Route, Switch, Link } from "react-router-dom";
import { Helmet } from "react-helmet";

import { HomePage } from "./home-page";
import { AdminFrame } from "./admin-frame";
import { CLIENT_STATE } from "./bootstrap";
import { LogoutButton } from "./logout-button";

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
                        <Link to={HomePage.FULL_PATH}>Home</Link>
                        <Link to={AdminFrame.PATH_PREFIX}>Admin</Link>
                        <LogoutButton />
                    </div>
                    <Switch>
                        <Route exact path={HomePage.FULL_PATH} component={HomePage} />
                        <Route path={AdminFrame.PATH_PREFIX} component={AdminFrame} />
                    </Switch>
                </main>
            </div>
        );
    }
}
