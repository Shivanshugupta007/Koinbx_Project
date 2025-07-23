import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from '../dto/create-order.dto';
import { KafkaService } from '../../kafka/service/kafka.service';
import { OrderStatus } from '../orders.types';

@Injectable()
export class OrdersService {
  constructor(
    private readonly kafkaService: KafkaService,
  ) {}

  // Handles order creation logic

  async placeOrder(createOrderDto: CreateOrderDto): Promise<any> {
    await this.kafkaService.produce('orders_topic', createOrderDto);
      return {
        message: 'Order received and will be processed shortly.',
        status: OrderStatus.OPEN,
      };
  }
}
