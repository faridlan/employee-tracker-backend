import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTargetDto } from './dto/create-target.dto';

@Injectable()
export class TargetService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateTargetDto) {
    const exists = await this.prisma.target.findFirst({
      where: {
        employee_id: data.employee_id,
        month: data.month,
        year: data.year,
      },
    });

    if (exists) {
      throw new BadRequestException(
        `Target for employee already exists for ${data.month}/${data.year}`,
      );
    }

    return this.prisma.target.create({
      data: {
        employee_id: data.employee_id,
        product_id: data.product_id,
        nominal: data.nominal,
        month: data.month,
        year: data.year,
      },
    });
  }

  async findAll() {
    return this.prisma.target.findMany({
      include: { employee: true, Achievement: true },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });
  }

  async findByEmployeeId(employeeId: string) {
    return this.prisma.target.findMany({
      where: { employee_id: employeeId },
      include: { employee: true, Achievement: true, Product: true },
      orderBy: [{ year: 'asc' }, { month: 'asc' }],
    });
  }
}
