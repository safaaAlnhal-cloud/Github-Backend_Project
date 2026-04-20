import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class GetUserDto {
  @Type(() => Number)
  @IsNumber()
  id!: number;
}