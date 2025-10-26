import { IsUUID, IsInt } from 'class-validator';

export class CreateAchievementDto {
  @IsUUID()
  target_id: string;

  @IsInt()
  nominal: number;
}
