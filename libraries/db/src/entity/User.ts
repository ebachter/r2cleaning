import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import {Order} from './Orders';

@Entity('users')
export class User {
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

  @OneToMany((type) => Order, (order) => order.user_fk, {
    cascade: true,
  })
  orders!: Order[];
}
