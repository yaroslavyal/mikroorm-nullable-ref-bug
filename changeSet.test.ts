import 'reflect-metadata';
import {
    LoadStrategy,
    MikroORM,
} from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import {Book} from "./entities/book.entity";
import {User} from "./entities/user.entity";
import {ProfileInfo} from "./entities/profileInfo.entity";


describe('Check', () => {

    let orm: MikroORM<PostgreSqlDriver>;

    beforeAll(async () => {
        orm = await MikroORM.init<any>({
            forceUtcTimezone: true,
            forceUndefined: false,
            debug: true,
            type: 'postgresql',
            user: 'user',
            port: 2345,
            password: 'password',
            host: 'localhost',
            loadStrategy: LoadStrategy.JOINED,
            tsNode: false,
            dbName: 'mydb',
            entities: [Book, User, ProfileInfo],
        });
        await orm.getSchemaGenerator().dropSchema();
        await orm.em.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
        await orm.getSchemaGenerator().createSchema();
    });

    afterAll(async () => {
        await orm.close(true);
    });

    test(`change set is empty`, async () => {
        const em = orm.em.fork()
        const user = em.create(User, {
            name: 'user1',
        });
        em.persist(user);

        await em.persist(em.create(Book, {
            name: 'book1',
            user,
        })).flush();
        await em.persist(em.create(Book, {
            name: 'book2',
            user,
        })).flush();

        await em.clear()

        const em1 = orm.em.fork();
        await em1.find(Book, {}, { populate: ['user'] })
        const uow1 = em1.getUnitOfWork(true)
        // property profileInfo of User entity is nullable and appears in computeChangeSets
        uow1.computeChangeSets();

        expect(uow1.getChangeSets()).toHaveLength(0);
    });

});
