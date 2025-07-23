import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { OrderStatus, OrderType } from '../orders.types';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column({ type: 'varchar', length: 4 })
  order_type: OrderType;

  @Column({ type: 'varchar', length: 10 })
  currency_symbol: string;

  @Column('decimal', { precision: 18, scale: 6 })
  price: number;

  @Column('decimal', { precision: 18, scale: 8 })
  quantity: number;

  @Column({ type: 'varchar', length: 10 })
  status: OrderStatus;
}

