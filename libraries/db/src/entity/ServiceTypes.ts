import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';

@Entity('service_types')
export class EntityServiceTypes {
  @PrimaryGeneratedColumn()
  service_type_id!: number;

  @Column('json', {nullable: false})
  serviceName!: {en: string; de: string; ru: string};
}
