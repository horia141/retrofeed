import * as React from "react";
import { Helmet } from "react-helmet";

export interface Props {
}

export interface State {
}

export class AdminFrame extends React.Component<Props, State> {

    public render(): JSX.Element {
        return (
            <div>
                <Helmet>
                    <title>The Admin</title>
                </Helmet>
                Hello
            </div>
        );
    }
}
