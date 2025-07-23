import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './service/order.service';
import { OrdersController } from './controller/orders.controller';
import { Order } from './entities/orders.entity';
import { KafkaModule } from 'src/kafka/kafka.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), KafkaModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
