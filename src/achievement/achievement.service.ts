import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAchievementDto } from './dto/create-achievement.dto';

@Injectable()
export class AchievementService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateAchievementDto) {
    return this.prisma.achievement.create({
      data: {
        target_id: data.target_id,
        nominal: data.nominal,
      },
    });
  }

  async findAll() {
    return this.prisma.achievement.findMany({
      include: { target: true },
    });
  }
}
