import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import {EntityServiceOffers} from './ServiceOffers';

@Entity('service_types')
export class EntityServiceTypes {
  @PrimaryGeneratedColumn()
  service_type_id!: number;

  @Column('json', {nullable: false})
  serviceName!: {en: string; de: string; ru: string};

  @OneToOne(() => EntityServiceOffers, (photo) => photo.service_type)
  service_type!: EntityServiceOffers;
}
