import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import {EntityUser} from './User';
import {
  objectTypes,
  ObjectDetails,
  TypeObjectTypesArr,
} from '../types/typesObject';

/* export type ObjectTypeOptions = [
  'house',
  'appartment',
  'entrance',
  'office',
  'fasade',
]; */

// type TupleToUnion<T extends unknown[]> = T[number];

const cities = ['grosny', 'argun', 'gudermes'] as const;

@Entity('objects')
export class EntityObject {
  @PrimaryGeneratedColumn()
  object_id!: number;

  // @Column('int', {nullable: false})
  // user_id!: number;

  @Column({type: 'enum', enum: cities})
  address_city!: (typeof cities)[number]; // Cleaning['object']['city'];

  @Column('varchar', {length: 500, nullable: false})
  address_street!: string;

  @Column({
    type: 'simple-enum',
    enum: objectTypes,
    // default: ObjectType.Draft,
  })
  object_type!: TypeObjectTypesArr[number]; //TupleToUnion<ObjectTypeOptions>; // Cleaning['object']['objectType'];

  @ManyToOne((type) => EntityUser, (user) => user.user_id, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({name: 'user_fk'}) // , referencedColumnName: 'user_id'
  user_fk!: number;

  @Column({
    name: 'area',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  area!: number;

  @Column('json', {nullable: false})
  object_details!: ObjectDetails;
  //{a: number; b: string; c: number}[];

  // @OneToMany(() => Order, (photo) => photo.order_id)
  // orders!: Order[];
}
