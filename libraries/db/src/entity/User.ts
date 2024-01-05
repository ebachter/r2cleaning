import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

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
}
