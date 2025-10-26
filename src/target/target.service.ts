import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTargetDto } from './dto/create-target.dto';

@Injectable()
export class TargetService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateTargetDto) {
    return this.prisma.target.create({
      data: {
        employee_id: data.employee_id,
        product_id: data.product_id,
        nominal: data.nominal,
        date: new Date(data.date),
      },
    });
  }

  async findAll() {
    return this.prisma.target.findMany({
      include: { employee: true, Achievement: true },
    });
  }

  async findByEmployeeId(employeeId: string) {
    return this.prisma.target.findMany({
      where: { employee_id: employeeId },
      include: { employee: true, Achievement: true, Product: true },
    });
  }
}
