import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('balances')
export class Balance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column({ length: 10 })
  currency_symbol: string;

  @Column('decimal', { precision: 18, scale: 8 })
  balance: number;
}
