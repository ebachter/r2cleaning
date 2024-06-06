import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import {ObjectTypeOptions, Cleaning} from '@remrob/mysql';
import {User} from './User';
import {Objects} from './Objects';

const obj: ObjectTypeOptions = [
  'house',
  'appartment',
  'entrance',
  'office',
  'fasade',
];

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  order_id!: number;

  // @Column('int', {nullable: false})
  // user_id!: number;

  @Column({
    type: 'simple-enum',
    enum: obj,
    // default: ObjectType.Draft,
  })
  object_type!: Cleaning['object']['objectType']; // TypeOrder['objectType'];

  @Column('simple-json', {nullable: true})
  data2!: {a: number; b: string; c: number}[];

  @ManyToOne((type) => User, (user) => user.user_id, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({name: 'user_fk'}) // , referencedColumnName: 'user_id'
  user_fk!: number;

  @ManyToOne((type) => Objects, (obj) => obj.object_id, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({name: 'object_fk'}) // , referencedColumnName: 'user_id'
  object_fk!: number;

  @Column({
    name: 'price',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  price!: number;

  @ManyToOne((type) => User, (user) => user.user_id, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({name: 'contractor_fk'}) // , referencedColumnName: 'user_id'
  contractor_fk!: number;
}
