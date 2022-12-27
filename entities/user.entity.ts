import {Collection, Entity, LoadStrategy, OneToMany, OneToOne, PrimaryKey, Property} from "@mikro-orm/core";
import {ProfileInfo} from "./profileInfo.entity";
import {Book} from "./book.entity";

@Entity()
export class User {
    @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
    id!: string;

    @Property()
    name!: string;

    @OneToOne({
        nullable: true,
        entity: () => ProfileInfo,
        owner: true,
        eager: true,
    })
    profileInfo?: ProfileInfo;

    @OneToMany({
        entity: () => Book,
        mappedBy: (book) => book.user,
        strategy: LoadStrategy.JOINED,
    })
    books = new Collection<Book>(this);
}
