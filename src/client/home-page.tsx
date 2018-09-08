import * as React from "react";
import { Helmet } from "react-helmet";

export interface Props {
}

export interface State {
}

export class HomePage extends React.Component<Props, State> {

    public render(): JSX.Element {
        return (
            <div>
                <Helmet>
                    <title>Home Man</title>
                </Helmet>
                World
            </div>
        );
    }
}
