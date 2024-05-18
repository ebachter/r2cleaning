import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import {TypeOrder, ObjectTypeOptions} from '@remrob/mysql';
import {User} from './User';

const obj: ObjectTypeOptions = [
  'house',
  'appartment',
  'entrance',
  'office',
  'fasade',
];

@Entity('objects')
export class Objects {
  @PrimaryGeneratedColumn()
  object_id!: number;

  // @Column('int', {nullable: false})
  // user_id!: number;

  @Column({
    type: 'simple-enum',
    enum: obj,
    // default: ObjectType.Draft,
  })
  object_type!: TypeOrder['objectType'];

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
