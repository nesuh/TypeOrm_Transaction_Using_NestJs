import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class accounts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  accountNumber: number;

  @Column({ default: 0 })
  balance: number;
}
