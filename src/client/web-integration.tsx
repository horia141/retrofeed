import * as React from "react";
import { Helmet } from "react-helmet";

import { CLIENT_CONFIG } from "./bootstrap";


interface FacebookOpenGraphProps {
    realLink: string;
    title: string;
    description: string;
}

export function FacebookOpenGraph(props: FacebookOpenGraphProps) {
    return (
        <Helmet>
            <meta property="og:type" content="website" />
            <meta property="og:url" content={props.realLink} />
            <meta property="og:title" content={props.title} />
            <meta property="og:description" content={props.description} />
            <meta property="og:site_name" content={CLIENT_CONFIG.name} />
            <meta property="og:image" content={CLIENT_CONFIG.logoUri} />
            <meta property="og:image:alt" content={props.description} />
            <meta property="fb:app_id" content={CLIENT_CONFIG.facebookAppId} />
        </Helmet>
    );
}

interface TwitterCardProps {
    title: string;
    description: string;
}

export function TwitterCard(props: TwitterCardProps) {
    return (
        <Helmet>
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content={props.title} />
            <meta name="twitter:description" content={props.description} />
            <meta name="twitter:creator" content={CLIENT_CONFIG.twitterHandle} />
            <meta name="twitter:site" content={CLIENT_CONFIG.twitterHandle} />
            <meta name="twitter:image" content={CLIENT_CONFIG.logoUri} />
        </Helmet>
    );
}
