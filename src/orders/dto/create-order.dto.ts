import { IsIn, IsInt, IsNumber, IsPositive, IsString, Min, Max } from 'class-validator';
import { OrderType } from '../orders.types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
    @ApiProperty({ example: 1, description: 'User ID (1-10)' })
    @IsInt()
    @Min(1)
    @Max(10)
    user_id: number;
    
    @ApiProperty({ example: 'buy', enum: [OrderType], description: 'Order type' })
    @IsString()
    @IsIn([OrderType])
    order_type: OrderType.BUY | OrderType.SELL;

    @ApiProperty({ example: 'BTC', enum: ['BTC', 'ETH'], description: 'Cryptocurrency symbol' })
    @IsString()
    @IsIn(['BTC', 'ETH'])
    currency_symbol: string;

    @ApiProperty({ example: 2.345678, description: 'Order price (6 decimals)' })
    @IsNumber({ maxDecimalPlaces: 6 })
    @Min(1.123456)
    @Max(9.123456)
    price: number;

    @ApiProperty({ example: 0.5, description: 'Order quantity' })
    @IsNumber()
    @IsPositive()
    quantity: number;
}
