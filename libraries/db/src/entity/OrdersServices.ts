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
import {EntityOrder} from './Orders';

@Entity('order_services')
export class EntityOrdersServices {
  @PrimaryGeneratedColumn()
  order_service_id!: number;

  @ManyToOne((type) => EntityOrder, (user) => user.order_id, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({name: 'order_fk'}) // , referencedColumnName: 'user_id'
  order_fk!: number;

  @ManyToOne((type) => EntityServiceTypes, (o) => o.service_type_id, {
    // onDelete: 'CASCADE',
    // nullable: true,
  })
  @JoinColumn({name: 'service_type_fk'}) // , referencedColumnName: 'user_id'
  service_type_fk!: number;

  @ManyToOne((type) => EntityUser, (user) => user.user_id, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({name: 'user_fk'}) // , referencedColumnName: 'user_id'
  user_fk!: number;
}
