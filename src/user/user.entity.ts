import { Entity, PrimaryGeneratedColumn, Column, AfterInsert, AfterRemove, AfterUpdate } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @AfterInsert()
    logInsert() {
        console.log('Inserted user id is', this.id);
    }

    @AfterRemove()
    logDelete() {
        console.log('Removed user id is', this.id);
    }

    @AfterUpdate()
    logUpdate() {
        console.log('Updated user id is', this.id);
    }
}