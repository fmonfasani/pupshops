import { Type } from 'class-transformer';
import { IsEmail, IsISO8601, IsNumber, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @Type(() => Number)
  @IsNumber()
  serviceId!: number;

  @IsString()
  customerName!: string;

  @IsEmail()
  customerEmail!: string;

  @IsISO8601()
  scheduledFor!: string;
}
