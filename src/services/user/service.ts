import { HttpException, HttpStatus, Inject, Injectable, Module } from "@nestjs/common";
import * as knex from "knex";
import * as moment from "moment";
import { MarshalFrom, Marshaller } from "raynor";

import { User, UserState } from "./entities";
import { UserCreationData, UserEventType } from "./events";

export class ServiceError extends HttpException {
    constructor() {
        super("Service Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
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
        "auth.users.display_name as user_display_name",
        "auth.users.nickname as user_nickname",
        "auth.users.picture_uri as user_picture_uri",
        "auth.users.provider_user_id as user_provider_user_id",
    ];

    private readonly userCreationDataMarshaller: Marshaller<UserCreationData> = new (MarshalFrom(UserCreationData))();
    private readonly conn: knex;

    public constructor(@Inject("DbConn") conn: knex) {
        this.conn = conn;
    }

    public async getOrCreateUser(
        agreedToPolicy: boolean,
        displayName: string,
        nickname: string,
        pictureUri: string,
        providerId: string,
    ): Promise<User> {
        const rightNow = moment.utc();

        let dbUser: any = null;

        await this.conn.transaction(async (trx) => {
            const rawResponse = await trx.raw(`
                    insert into auth.users (
                        state,
                        agreed_to_policy,
                        display_name,
                        nickname,
                        picture_uri,
                        provider_user_id,
                        time_created,
                        time_last_updated)
                    values (
                        :state,
                        :agreed_to_policy,
                        :display_name,
                        :nickname,
                        :picture_uri,
                        :provider_user_id,
                        :right_now,
                        :right_now)
                    on conflict (provider_user_id)
                    do update
                    set
                        state = '${UserState.Active}',
                        agreed_to_policy = auth.users.agreed_to_policy OR excluded.agreed_to_policy,
                        display_name = excluded.display_name,
                        nickname = excluded.nickname,
                        picture_uri = excluded.picture_uri,
                        time_last_updated = excluded.time_last_updated
                    returning
                        id as user_id,
                        agreed_to_policy as user_agreed_to_policy,
                        display_name as user_display_name,
                        nickname as user_nickname,
                        picture_uri as user_picture_uri,
                        time_created,
                        time_last_updated
                `, {
                    state: UserState.Active,
                    agreed_to_policy: agreedToPolicy,
                    display_name: displayName,
                    nickname,
                    picture_uri: pictureUri,
                    provider_user_id: providerId,
                    right_now: rightNow.toDate(),
                });

            if (rawResponse.rows.length !== 1) {
                throw new ServiceError();
            }

            const dbUserId = rawResponse.rows[0].user_id;
            const dbAgreedToPolicy = rawResponse.rows[0].user_agreed_to_policy;
            dbUser = rawResponse.rows[0];

            const userEventType =
                rawResponse.rows[0].time_created.getTime() === rawResponse.rows[0].time_last_updated.getTime()
                ? UserEventType.Created
                : UserEventType.Recreated;

            const userCreationData = new UserCreationData();
            userCreationData.agreedToPolicy = agreedToPolicy;
            userCreationData.displayName = displayName;
            userCreationData.nickname = nickname;
            userCreationData.pictureUri = pictureUri;

            await trx
                .from("auth.user_events")
                .insert({
                    type: userEventType,
                    timestamp: rightNow,
                    data: this.userCreationDataMarshaller.pack(userCreationData),
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

        return this.dbUserToUser(dbUser, providerId);
    }

    public async getUserByProviderId(providerId: string): Promise<User> {
        const dbUsers = await this.conn("auth.users")
            .select(UserService.userFields)
            .where({ provider_user_id: providerId, state: UserState.Active })
            .limit(1);

        if (dbUsers.length === 0) {
            throw new UserNotFoundError("User does not exist");
        }

        return this.dbUserToUser(dbUsers[0], providerId);
    }

    private dbUserToUser(dbUser: any, providerId: string): User {
        const user = new User();
        user.id = dbUser.user_id;
        user.agreedToPolicy = dbUser.user_agreed_to_policy;
        user.displayName = dbUser.user_display_name;
        user.nickname = dbUser.user_nickname;
        user.pictureUri = dbUser.user_picture_uri;
        user.providerId = providerId;
        return user;
    }
}

@Module({
    providers: [UserService],
    exports: [UserService],
})
export class UserModule { }
