import * as React from "react";
import { Helmet } from "react-helmet";

import { CLIENT_CONFIG, CLIENT_STATE } from "./bootstrap";

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

        return (
            <div>
                <Helmet>
                    <title>The Admin</title>
                    <link rel="canonical" href={`${CLIENT_CONFIG.externalOrigin}${AdminFrame.PATH_PREFIX}`} />
                </Helmet>
                Hello
            </div>
        );
    }
}
