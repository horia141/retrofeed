export enum Headers {
    RequestId = "X-RetroFeed-RequestId",
}

export enum Env {
    Local,
    Test,
    Staging,
    Live,
}

export function parseEnv(env: string | undefined): Env {
    if (env === undefined) {
        throw new Error("Environment is not defined");
    }

    switch (env.toUpperCase()) {
        case "LOCAL":
            return Env.Local;
        case "TEST":
            return Env.Test;
        case "STAGING":
            return Env.Staging;
        case "LIVE":
            return Env.Live;
        default:
            throw new Error(`Invalid environment ${env}`);
    }
}

export function envToString(env: Env): string {
    switch (env) {
        case Env.Local:
            return "LOCAL";
        case Env.Test:
            return "TEST";
        case Env.Staging:
            return "STAGING";
        case Env.Live:
            return "LIVE";
    }
}

export function isLocal(env: Env): boolean {
    return env === Env.Local;
}

export function isForDevelopment(env: Env): boolean {
    return env === Env.Local || env === Env.Test || env === Env.Staging;
}

export function isNotOnServer(env: Env): boolean {
    return !isOnServer(env);
}

export function isOnServer(env: Env): boolean {
    return env === Env.Staging || env === Env.Live;
}
