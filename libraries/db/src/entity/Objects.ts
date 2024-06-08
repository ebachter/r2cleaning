import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
// import {ObjectTypeOptions} from '@remrob/mysql';
import {User} from './User';
// import {Cleaning} from '@remrob/mysql';

export type ObjectTypeOptions = [
  'house',
  'appartment',
  'entrance',
  'office',
  'fasade',
];

// type TupleToUnion<T extends unknown[]> = T[number];

const objectTypes = [
  'house',
  'appartment',
  'entrance',
  'office',
  'fasade',
] as const;

const cities = ['grosny', 'argun', 'gudermes'] as const;

@Entity('objects')
export class Objects {
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
  object_type!: (typeof objectTypes)[number]; //TupleToUnion<ObjectTypeOptions>; // Cleaning['object']['objectType'];

  @Column('simple-json', {nullable: true})
  data!: {a: number; b: string; c: number}[];

  @ManyToOne((type) => User, (user) => user.user_id, {
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
}
