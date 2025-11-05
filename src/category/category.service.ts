import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { normalizeName } from '../utils/normalize';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCategoryDto) {
    const name_norm = normalizeName(data.name);

    const exists = await this.prisma.category.findUnique({
      where: { name_norm },
      select: { id: true },
    });
    if (exists) {
      throw new HttpException(
        {
          statusCode: 400,
          errorCode: 'CATEGORY_NAME_EXISTS',
          message: 'Category name already exists',
        },
        400,
      );
    }

    return this.prisma.category.create({
      data: { name: data.name.trim(), name_norm },
    });
  }

  // exclude soft-deleted by default
  findAll() {
    return this.prisma.category.findMany({
      where: { deleted_at: null },
      include: { products: true },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string) {
    return this.prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    if (!dto.name) {
      throw new BadRequestException('Name is required');
    }

    const normalized = dto.name.trim().toLowerCase();

    const existing = await this.prisma.category.findFirst({
      where: { name_norm: normalized },
    });

    if (existing && existing.id !== id) {
      throw new BadRequestException({
        statusCode: 400,
        errorCode: 'CATEGORY_NAME_EXISTS',
        message: 'Category name already exists',
      });
    }

    return this.prisma.category.update({
      where: { id },
      data: {
        name: dto.name,
        name_norm: normalized,
      },
    });
  }

  // D3: soft delete category if no products
  async delete(id: string) {
    const count = await this.prisma.product.count({
      where: { category_id: id },
    });
    if (count > 0) {
      throw new HttpException(
        {
          statusCode: 400,
          errorCode: 'CATEGORY_IN_USE',
          message: 'Cannot delete category with assigned products',
        },
        400,
      );
    }

    return this.prisma.category.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }
}
