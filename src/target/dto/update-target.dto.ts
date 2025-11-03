/* eslint-disable @typescript-eslint/no-unsafe-call */
import { PartialType } from '@nestjs/mapped-types';
import { CreateTargetDto } from './create-target.dto';
import { IsInt, Max, Min, IsUUID, IsOptional } from 'class-validator';

export class UpdateTargetDto extends PartialType(CreateTargetDto) {
  @IsOptional()
  @IsUUID()
  employee_id?: string;

  @IsOptional()
  @IsUUID()
  product_id?: string;

  @IsOptional()
  @IsInt()
  nominal?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  month?: number;

  @IsOptional()
  @IsInt()
  year?: number;
}
