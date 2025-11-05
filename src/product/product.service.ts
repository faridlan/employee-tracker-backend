import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { normalizeName } from '../utils/normalize';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateProductDto) {
    // category must exist and not soft-deleted
    const category = await this.prisma.category.findFirst({
      where: { id: data.category_id, deleted_at: null },
      select: { id: true },
    });
    if (!category) {
      throw new HttpException(
        {
          statusCode: 400,
          errorCode: 'CATEGORY_NOT_FOUND',
          message: 'Category not found or inactive',
        },
        400,
      );
    }

    const name = data.name.trim();
    const name_norm = normalizeName(name);

    const exists = await this.prisma.product.findUnique({
      where: { name_norm },
      select: { id: true },
    });
    if (exists) {
      throw new HttpException(
        {
          statusCode: 400,
          errorCode: 'PRODUCT_NAME_EXISTS',
          message: 'Product name already exists',
        },
        400,
      );
    }

    return this.prisma.product.create({
      data: { name, name_norm, category_id: data.category_id },
    });
  }

  // optionally exclude products whose category is soft-deleted
  findAll() {
    return this.prisma.product.findMany({
      where: { category: { deleted_at: null } },
      include: { category: true },
      orderBy: { name: 'asc' },
    });
  }

  findById(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  async update(id: string, dto: UpdateProductDto) {
    const { name, category_id } = dto;

    // Normalize name safely
    const normalizedName = name.trim().toLowerCase();

    // Check duplicate name for another product
    const exists = await this.prisma.product.findFirst({
      where: {
        name_norm: normalizedName,
        NOT: { id },
      },
    });
    if (exists) {
      throw new BadRequestException('Product name already exists');
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        name,
        name_norm: normalizedName,
        category_id,
      },
    });
  }

  // D3: hard delete product only if no targets
  async delete(id: string) {
    const targetCount = await this.prisma.target.count({
      where: { product_id: id },
    });
    if (targetCount > 0) {
      throw new HttpException(
        {
          statusCode: 400,
          errorCode: 'PRODUCT_IN_USE',
          message: 'Cannot delete product with existing targets',
        },
        400,
      );
    }

    return this.prisma.product.delete({
      where: { id },
    });
  }
}
