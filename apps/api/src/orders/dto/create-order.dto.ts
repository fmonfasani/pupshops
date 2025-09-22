import { Type } from 'class-transformer';
import { IsNumber, IsPositive } from 'class-validator';

export class CreateOrderDto {
  @Type(() => Number)
  @IsNumber()
  userId!: number;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  total!: number;
}
