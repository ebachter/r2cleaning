import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import {EntityServiceTypes} from './ServiceTypes';
import {EntityUser} from './User';

@Entity('service_offers')
export class EntityServiceOffers {
  @PrimaryGeneratedColumn()
  service_offer_id!: number;

  // @Column('int')
  @ManyToOne((type) => EntityServiceTypes, (o) => o.service_type_id, {
    onDelete: 'CASCADE',
    // nullable: true,
  })
  // @JoinColumn({name: 'service_type_fk'}) // , referencedColumnName: 'user_id'
  service_type!: EntityServiceTypes;

  // @Column('int')
  // user_fk!: number;

  @Column({
    name: 'price',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  price!: number | null;

  // @Column('int')
  @ManyToOne((type) => EntityUser, (user) => user.user_id, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  // @JoinColumn({name: 'user_fk'}) // , referencedColumnName: 'user_id'
  user!: EntityUser;
}
