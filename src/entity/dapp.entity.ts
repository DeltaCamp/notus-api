import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Dapp {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ length: 120 })
    public dappName: string = '';

    @Column({ length: 320 })
    public email: string = '';

    @Column('int')
    views: number;
}
