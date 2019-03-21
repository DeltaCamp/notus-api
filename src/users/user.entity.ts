import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Dapp {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 120 })
    name: string = '';

    @Column({ length: 320 })
    email: string = '';

    @Column()
    confirmed: boolean = false;

    @Column()
    confirmation_code: string = '';
}
