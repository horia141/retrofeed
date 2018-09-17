import * as React from "react";
import { Helmet } from "react-helmet";
import { Link, Route, Switch } from "react-router-dom";

import { AdminFrame } from "./admin-frame";
import { CLIENT_STATE } from "./bootstrap";
import { HomePage } from "./home-page";
import { LogoutButton } from "./logout-button";
import { NotFoundPage } from "./not-found-page";

export class AppFrame extends React.Component<{}, {}> {

    public render(): JSX.Element {
        return (
            <div>
                <Helmet>
                    <html lang={CLIENT_STATE().language} />
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
                        <Route path={NotFoundPage.FULL_PATH} component={NotFoundPage} />
                        <Route path="*" component={NotFoundPage} />
                    </Switch>
                </main>
            </div>
        );
    }
}
