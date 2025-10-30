import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateAchievementDto,
  UpdateAchievementDto,
} from './dto/create-achievement.dto';

@Injectable()
export class AchievementService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateAchievementDto) {
    const target = await this.prisma.target.findUnique({
      where: { id: data.target_id },
      include: { Achievement: true },
    });

    if (!target) throw new NotFoundException('Target not found');

    if (target.Achievement)
      throw new BadRequestException(
        'Achievement already exists for this target',
      );

    return this.prisma.achievement.create({
      data: {
        target_id: data.target_id,
        nominal: data.nominal,
      },
      include: { target: true },
    });
  }

  async update(targetId: string, dto: UpdateAchievementDto) {
    const achievement = await this.prisma.achievement.findUnique({
      where: { target_id: targetId },
    });
    if (!achievement) throw new NotFoundException('Achievement not found');

    return this.prisma.achievement.update({
      where: { target_id: targetId },
      data: { nominal: dto.nominal },
      include: { target: true },
    });
  }

  async findAll() {
    return this.prisma.achievement.findMany({
      include: {
        target: { include: { employee: true, Product: true } },
      },
      orderBy: { created_at: 'desc' },
    });
  }
}
