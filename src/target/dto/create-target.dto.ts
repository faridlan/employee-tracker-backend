import { IsUUID, IsInt, Min, Max } from 'class-validator';

export class CreateTargetDto {
  @IsUUID()
  employee_id: string;

  @IsUUID()
  product_id: string;

  @IsInt()
  nominal: number;

  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @IsInt()
  year: number;
}
