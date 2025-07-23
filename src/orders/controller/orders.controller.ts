import { Controller, Post, Body } from '@nestjs/common';
import { OrdersService } from '../service/order.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';


@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Place a buy or sell order' })
  @ApiBody({ type: CreateOrderDto })
  async placeOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.placeOrder(createOrderDto);
  }
}
