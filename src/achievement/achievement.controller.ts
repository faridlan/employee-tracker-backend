import { Body, Controller, Get, Post } from '@nestjs/common';
import { AchievementService } from './achievement.service';
import { CreateAchievementDto } from './dto/create-achievement.dto';

@Controller('achievements')
export class AchievementController {
  constructor(private readonly achievementService: AchievementService) {}

  @Post()
  create(@Body() dto: CreateAchievementDto) {
    return this.achievementService.create(dto);
  }

  @Get()
  findAll() {
    return this.achievementService.findAll();
  }
}
