import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dro/create-product.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        name: data.name,
        category_id: data.category_id,
      },
    });
  }

  findAll() {
    return this.prisma.product.findMany({
      include: { category: true },
    });
  }

  findById(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
  }
}
