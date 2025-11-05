import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsUUID()
  category_id?: string;
}
