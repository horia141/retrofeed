import * as React from "react";
import { Helmet } from "react-helmet";

export class NotFoundPage extends React.Component<{}, {}> {

    public static readonly FULL_PATH: string = "/not-found";

    public render(): JSX.Element {
        return (
            <div>
                <Helmet>
                    <title>Not Found</title>
                    <meta name="robots" content="noindex,nofollow" />
                </Helmet>
                <h1>Not Found</h1>
            </div>
        )
    }
}
