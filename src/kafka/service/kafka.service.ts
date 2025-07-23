import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer, Consumer } from 'kafkajs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Balance } from '../../balance/entities/balance.entity';
import { Order } from '../../orders/entities/orders.entity';
import { OrderStatus, OrderType } from 'src/orders/orders.types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KafkaService implements OnModuleInit {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;

  constructor(
    @InjectRepository(Balance)
    private balancesRepository: Repository<Balance>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    private readonly config: ConfigService
  ) {
    this.kafka = new Kafka({
      clientId: this.config.get<string>('KAFKA_CLIENT_ID'),
      brokers: this.config.get<string>('KAFKA_BROKERS', 'localhost:9092').split(','),
    });

    // Initialize Kafka producer & consumer

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: this.config.get<string>('KAFKA_GROUP_ID', 'order-processing-group') });
  }

  async onModuleInit() {
    await this.producer.connect();
    await this.consumer.connect();

    // Subscribe to the Kafka topic where orders are published

    await this.consumer.subscribe({ topic: 'orders_topic', fromBeginning: false });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        if (!message.value) {
          console.warn('Received message with null value');
          return;
        }

        // Parse incoming message

        const orderData = JSON.parse(message.value.toString());
        console.log('Processing order from Kafka:', orderData);

        try {
          await this.processOrder(orderData);
        } catch (error) {
          console.error('Error processing order:', error);
        }
      },
    });
  }

  // Sends a message to a Kafka topic

  async produce(topic: string, message: any) {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  }

  // Handles logic when processing order message from Kafka

  private async processOrder(orderData: any) {
    const { user_id, order_type, currency_symbol, price, quantity } = orderData;

    const existingBalance = await this.balancesRepository.findOne({
      where: { user_id, currency_symbol },
    });

    // Handle BUY orders

    if (order_type === OrderType.BUY) {
      let matchedOrder = await this.ordersRepository.findOne({
        where: {
          user_id,
          currency_symbol,
          price,
          order_type: OrderType.BUY,
          status: OrderStatus.OPEN,
        },
      });

      // If matching order exists, add quantity to it

      if (matchedOrder) {
        matchedOrder.quantity += quantity;
        await this.ordersRepository.save(matchedOrder);
      } else {
        // Otherwise, create a new BUY order
        const newOrder = this.ordersRepository.create({
          user_id,
          order_type,
          currency_symbol,
          price,
          quantity,
          status: OrderStatus.OPEN,
        });
        await this.ordersRepository.save(newOrder);
      }
      // Update or initialize balance for user
      if (existingBalance) {
        existingBalance.balance += quantity;
        await this.balancesRepository.save(existingBalance);
      } else {
        const newBalance = this.balancesRepository.create({
          user_id,
          currency_symbol,
          balance: quantity,
        });
        await this.balancesRepository.save(newBalance);
      }
    } else if (order_type === OrderType.SELL) {
      // Handle SELL orders
      if (!existingBalance || existingBalance.balance < quantity) {
        const failedOrder = this.ordersRepository.create({
          user_id,
          order_type,
          currency_symbol,
          price,
          quantity,
          status: OrderStatus.CANCELLED,
        });
        await this.ordersRepository.save(failedOrder);
        return;
      }
      existingBalance.balance -= quantity;
      await this.balancesRepository.save(existingBalance);

      // Mark sell order as CLOSED

      const newSellOrder = this.ordersRepository.create({
        user_id,
        order_type,
        currency_symbol,
        price,
        quantity,
        status: OrderStatus.CLOSED,
      });
      await this.ordersRepository.save(newSellOrder);
    }
  }
}
