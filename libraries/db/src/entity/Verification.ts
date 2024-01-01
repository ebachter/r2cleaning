import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
// bimport { User } from "./User"

@Entity('verification')
export class Verification {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  phoneNumber!: string;

  @Column()
  verificationID!: string;

  // @OneToOne(() => User)
  // @JoinColumn()
  // user: User
}
