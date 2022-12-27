import {Entity, LoadStrategy, OneToOne, PrimaryKey, Property} from "@mikro-orm/core";
import {User} from "./user.entity";

@Entity()
export class ProfileInfo {
    @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
    id!: string;

    @Property()
    email!: string;

    @OneToOne({
        entity: () => User,
        mappedBy: (user) => user.profileInfo,
        strategy: LoadStrategy.JOINED,
        owner: false,
    })
    user!: User;
}
