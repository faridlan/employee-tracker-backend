import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.employee.findMany({
      where: { deleted_at: null }, // ✅ don’t show deleted employees
      include: {
        targets: {
          where: { deleted_at: null }, // ✅ don’t show deleted targets
          include: { Product: true, Achievement: true },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.employee.findFirst({
      where: { id, deleted_at: null },
      include: {
        targets: {
          where: { deleted_at: null }, // ✅ only active targets
          include: { Product: true, Achievement: true },
        },
      },
    });
  }
  async create(data: Prisma.EmployeeCreateInput) {
    return this.prisma.employee.create({ data });
  }

  async update(id: string, data: Prisma.EmployeeUpdateInput) {
    return this.prisma.employee.update({
      where: { id },
      data,
    });
  }

  /**
   * Soft Delete — just set deleted_at timestamp
   */
  async softDelete(id: string) {
    return this.prisma.employee.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }

  /**
   * Optional: Hard delete (permanently)
   */
  async hardDelete(id: string) {
    return this.prisma.employee.delete({ where: { id } });
  }
}
