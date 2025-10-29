import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { AchievementService } from './achievement.service';
import {
  CreateAchievementDto,
  UpdateAchievementDto,
} from './dto/create-achievement.dto';

@Controller('achievements')
export class AchievementController {
  constructor(private readonly achievementService: AchievementService) {}

  @Post()
  create(@Body() dto: CreateAchievementDto) {
    return this.achievementService.create(dto);
  }

  @Put(':targetId')
  update(
    @Param('targetId') targetId: string,
    @Body() dto: UpdateAchievementDto,
  ) {
    return this.achievementService.update(targetId, dto);
  }

  @Get()
  findAll() {
    return this.achievementService.findAll();
  }
}
