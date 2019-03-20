import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Dapp {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 120 })
    dappName: string = '';

    @Column({ length: 320 })
    email: string = '';

    @Column('int')
    views: number;

    @Column()
    apiKey: string = '';

    @Column()
    confirmed: boolean = false;

    @Column()
    confirmationCode: string = '';
}
