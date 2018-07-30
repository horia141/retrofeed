import { HttpException, HttpStatus, Inject, Injectable, Module } from "@nestjs/common";
import * as knex from "knex";
import * as moment from "moment";
import { MarshalFrom, Marshaller } from "raynor";

import { AuthProviderProfile } from "../auth/auth";

export enum UserState {
    Unknown = 0,
    Active = 1,
    Removed = 2,
}

export class User {
    public id: number = -1;
    public agreedToPolicy: boolean = false;
    public profile: AuthProviderProfile = new AuthProviderProfile();
}

export enum UserEventType {
    Unknown = 0,
    Created = 1,
    Recreated = 2,
    Removed = 3,
    AgreedToPolicy = 4,
}

export class UserNotFoundError extends HttpException {
    constructor(message: string) {
        super(message, HttpStatus.NOT_FOUND);
    }
}

@Injectable()
export class UserService {

    private static readonly userFields = [
        "auth.users.id as user_id",
        "auth.users.state as user_state",
        "auth.users.agreed_to_policy as user_agreed_to_policy",
        "auth.users.provider_user_id as user_provider_user_id",
        "auth.users.provider_profile as user_provider_profile",
    ];

    private readonly profileMarshaller: Marshaller<AuthProviderProfile> = new (MarshalFrom(AuthProviderProfile))();

    private readonly conn: knex;

    public constructor(@Inject("DbConn") conn: knex) {
        this.conn = conn;
    }

    public async getOrCreateUser(agreedToPolicy: boolean, profile: AuthProviderProfile): Promise<User> {
        const rightNow = moment.utc();

        let dbUserId: number = -1;
        let dbAgreedToPolicy: boolean = false;
        let userEventType: UserEventType = UserEventType.Unknown;

        await this.conn.transaction(async (trx) => {
            const rawResponse = await trx.raw(`
                    insert into auth.users (
                        state,
                        agreed_to_policy,
                        provider_user_id,
                        provider_profile,
                        time_created,
                        time_last_updated)
                    values (
                        :state,
                        :agreed_to_policy,
                        :provider_user_id,
                        :provider_profile,
                        :right_now,
                        :right_now)
                    on conflict (provider_user_id)
                    do update
                    set time_last_updated = excluded.time_last_updated,
                        state = ${UserState.Active},
                        agreed_to_policy = auth.users.agreed_to_policy OR excluded.agreed_to_policy,
                        provider_profile = excluded.provider_profile
                    returning id, time_created, time_last_updated, agreed_to_policy
                `, {
                    state: UserState.Active,
                    agreed_to_policy: agreedToPolicy,
                    provider_user_id: profile.userId,
                    provider_profile: this.profileMarshaller.pack(profile),
                    right_now: rightNow.toDate(),
                });

            dbUserId = rawResponse.rows[0].id;
            dbAgreedToPolicy = rawResponse.rows[0].agreed_to_policy;

            userEventType =
                rawResponse.rows[0].time_created.getTime() === rawResponse.rows[0].time_last_updated.getTime()
                ? UserEventType.Created
                : UserEventType.Recreated;

            await trx
                .from("auth.user_events")
                .insert({
                    type: userEventType,
                    timestamp: rightNow,
                    data: null,
                    user_id: dbUserId,
                });

            if (userEventType === UserEventType.Created && dbAgreedToPolicy === true) {
                await trx
                    .from("auth.user_events")
                    .insert({
                        type: UserEventType.AgreedToPolicy,
                        timestamp: rightNow,
                        data: null,
                        user_id: dbUserId,
                    });
            }
        });

        const user = new User();
        user.id = dbUserId;
        user.agreedToPolicy = dbAgreedToPolicy;
        user.profile = profile;

        return user;
    }

    public async getUserByProfileId(profileId: string): Promise<User> {
        const dbUsers = await this.conn("auth.users")
            .select(UserService.userFields)
            .where({ provider_user_id: profileId, state: UserState.Active })
            .limit(1);

        if (dbUsers.length === 0) {
            throw new UserNotFoundError("User does not exist");
        }

        return this.dbUserToUser(dbUsers[0]);
    }

    private dbUserToUser(dbUser: any): User {
        const user = new User();
        user.id = dbUser.user_id;
        user.agreedToPolicy = dbUser.user_agreed_to_policy;
        user.profile = this.profileMarshaller.extract(dbUser.user_provider_profile);
        return user;
    }
}

@Module({
    providers: [UserService],
    exports: [UserService],
})
export class UserModule { }
