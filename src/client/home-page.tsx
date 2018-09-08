import * as React from "react";
import { Helmet } from "react-helmet";

import { CLIENT_CONFIG } from "./bootstrap";

export interface Props {
}

export interface State {
}

export class HomePage extends React.Component<Props, State> {

    public static readonly FULL_PATH: string = "/";

    public render(): JSX.Element {
        return (
            <div>
                <Helmet>
                    <title>Home Man</title>
                    <link rel="canonical" href={`${CLIENT_CONFIG.externalOrigin}}${HomePage.FULL_PATH}`} />
                </Helmet>
                World
            </div>
        );
    }
}
