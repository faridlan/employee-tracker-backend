import { IsUUID, IsInt, IsDateString } from 'class-validator';

export class CreateTargetDto {
  @IsUUID()
  employee_id: string;

  @IsUUID()
  product_id: string;

  @IsInt()
  nominal: number;

  @IsDateString()
  date: string;
}
