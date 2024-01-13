import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

export enum ObjectType {
  grosny = 'Грозный',
  argun = 'Аргун',
  gudermes = 'Гудермес',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'simple-enum',
    enum: ObjectType,
    // default: ObjectType.Draft,
  })
  objectType!: ObjectType;

  @Column('simple-json', {nullable: true})
  data!: {a: number; b: string}[];
}
