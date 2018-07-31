import * as moment from "moment";

export enum UserEventType {
    Unknown = 0,
    Created = 1,
    Recreated = 2,
    Removed = 3,
    AgreedToPolicy = 4,
}

export class UserEvent {
    public type: UserEventType = UserEventType.Unknown;
    public timestamp: moment.Moment = moment.utc();
    public data: null = null;
}
