import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTargetDto } from './dto/create-target.dto';
import { UpdateTargetDto } from './dto/update-target.dto';

@Injectable()
export class TargetService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateTargetDto) {
    const exists = await this.prisma.target.findFirst({
      where: {
        employee_id: data.employee_id,
        month: data.month,
        year: data.year,
        deleted_at: null,
      },
    });

    if (exists) {
      throw new BadRequestException(
        `Target for employee already exists for ${data.month}/${data.year}`,
      );
    }

    return this.prisma.target.create({ data });
  }

  async findAll() {
    return this.prisma.target.findMany({
      where: { deleted_at: null },
      include: { employee: true, Achievement: true, Product: true },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });
  }

  async findByEmployeeId(employeeId: string) {
    return this.prisma.target.findMany({
      where: { employee_id: employeeId, deleted_at: null },
      include: { employee: true, Achievement: true, Product: true },
      orderBy: [{ year: 'asc' }, { month: 'asc' }],
    });
  }

  async update(id: string, data: UpdateTargetDto) {
    const target = await this.prisma.target.findUnique({ where: { id } });
    if (!target || target.deleted_at)
      throw new NotFoundException('Target not found');

    // validate unique month-year rule only if month/year or employee change
    if (data.month || data.year || data.employee_id) {
      const exists = await this.prisma.target.findFirst({
        where: {
          id: { not: id },
          employee_id: data.employee_id ?? target.employee_id,
          month: data.month ?? target.month,
          year: data.year ?? target.year,
          deleted_at: null,
        },
      });

      if (exists) {
        throw new BadRequestException(
          `Employee already has target for that month & year`,
        );
      }
    }

    return this.prisma.target.update({ where: { id }, data });
  }

  async softDelete(id: string) {
    const target = await this.prisma.target.findUnique({
      where: { id },
      include: { Achievement: true },
    });

    if (!target || target.deleted_at)
      throw new NotFoundException('Target not found');

    return this.prisma.$transaction(async (tx) => {
      // 1. Hard delete achievement if exists
      if (target.Achievement) {
        await tx.achievement.delete({
          where: { target_id: id },
        });
      }

      // 2. Soft delete target
      await tx.target.update({
        where: { id },
        data: { deleted_at: new Date() },
      });

      return {
        message: 'Target deleted and related Achievement permanently removed',
      };
    });
  }
}
