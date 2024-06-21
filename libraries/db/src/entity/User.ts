import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import {EntityOrder} from './Orders';

@Entity('users')
export class EntityUser {
  @PrimaryGeneratedColumn()
  user_id!: number;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({nullable: true})
  age!: number;

  @Column('double', {default: 0})
  balance!: number;

  @Column()
  phoneNumber!: string;

  @Column('json', {nullable: true})
  data!: {a: number; b: string}[];

  @OneToMany((type) => EntityOrder, (order) => order.user_fk, {
    cascade: true,
  })
  orders!: EntityOrder[];
}
