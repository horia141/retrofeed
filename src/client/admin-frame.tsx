import * as React from "react";
import { Helmet } from "react-helmet";

import { CLIENT_CONFIG, CLIENT_STATE } from "./bootstrap";
import { FacebookOpenGraph, TwitterCard } from "./web-integration";

export interface Props {
}

export interface State {
}

export class AdminFrame extends React.Component<Props, State> {

    public static readonly PATH_PREFIX = "/admin";

    componentDidMount() {
        if (CLIENT_STATE.user === null) {
            window.location.assign(CLIENT_CONFIG.loginPath);
        }
    }

    public render(): JSX.Element {
        if (CLIENT_STATE.user === null) {
            return <div>Should be logged in</div>;
        }

        const realLink = `${CLIENT_CONFIG.externalOrigin}${AdminFrame.PATH_PREFIX}`;

        return (
            <div>
                <Helmet>
                    <title>The Admin</title>
                    <link rel="canonical" href={realLink} />
                </Helmet>
                <FacebookOpenGraph realLink={realLink} title="The Admin" description="The Admin" />
                <TwitterCard title="The Admin" description="The Admin" />
                Hello
            </div>
        );
    }
}
