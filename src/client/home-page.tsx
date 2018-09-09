import * as React from "react";
import { Helmet } from "react-helmet";

import { CLIENT_CONFIG } from "./bootstrap";
import { FacebookOpenGraph, TwitterCard } from "./web-integration";

export interface Props {
}

export interface State {
}

export class HomePage extends React.Component<Props, State> {

    public static readonly FULL_PATH: string = "/";

    public render(): JSX.Element {
        const realLink = `${CLIENT_CONFIG.externalOrigin}}${HomePage.FULL_PATH}`;
        return (
            <div>
                <Helmet>
                    <title>Home Man</title>
                    <link rel="canonical" href={realLink} />
                </Helmet>
                <FacebookOpenGraph realLink={realLink} title="Home Man" description="The Home" />
                <TwitterCard title="Home Man" description="The Home" />
                World
            </div>
        );
    }
}
