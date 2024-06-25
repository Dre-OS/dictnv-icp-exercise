import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user';

@Entity({
  name: 'messages',
})
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: true })
  message: string;
 
  @ManyToOne(() => User)
  user: User;
}
