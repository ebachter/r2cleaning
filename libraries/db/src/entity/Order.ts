import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';
import {TypeOrder, ObjectTypeOptions} from '@remrob/mysql';

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
  id!: number;

  @Column({
    type: 'simple-enum',
    enum: obj,
    // default: ObjectType.Draft,
  })
  objectType!: TypeOrder['objectType'];

  @Column('simple-json', {nullable: true})
  data!: {a: number; b: string}[];
}
