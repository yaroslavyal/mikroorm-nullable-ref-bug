import {Entity, LoadStrategy, ManyToOne, PrimaryKey, Property} from "@mikro-orm/core";
import {User} from "./user.entity";

@Entity()
export class Book {
    @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
    id!: string;

    @Property()
    name!: string;

    @Property({ nullable: true })
    description?: string;

    @ManyToOne({
        entity: () => User,
        strategy: LoadStrategy.JOINED,
    })
    user!: User;

}
