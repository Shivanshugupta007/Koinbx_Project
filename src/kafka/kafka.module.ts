import { Module } from '@nestjs/common';
import { KafkaService } from './service/kafka.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../orders/entities/orders.entity';
import { Balance } from '../balance/entities/balance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Balance])],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}
