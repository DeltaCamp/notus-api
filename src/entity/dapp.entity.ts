import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Dapp {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ length: 120 })
    public name: string = '';

    @Column('int')
    views: number;
}
