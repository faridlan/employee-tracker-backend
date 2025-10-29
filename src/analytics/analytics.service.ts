import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Target, Achievement } from '@prisma/client';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getEmployeePerformance(employeeId: string) {
    const targets = (await this.prisma.target.findMany({
      where: { employee_id: employeeId },
      include: { Achievement: true },
      orderBy: [{ year: 'asc' }, { month: 'asc' }],
    })) as (Target & { Achievement: Achievement | null })[];

    return targets.map((t) => {
      const achievementNominal = t.Achievement?.nominal ?? 0;
      const percentage =
        t.nominal > 0 ? (achievementNominal / t.nominal) * 100 : 0;

      return {
        month: `${t.year}-${String(t.month).padStart(2, '0')}`,
        target: t.nominal,
        achievement: achievementNominal,
        percentage,
      };
    });
  }

  async getProductTargetSummary() {
    const result = await this.prisma.target.groupBy({
      by: ['product_id'],
      _sum: { nominal: true },
    });

    // Join with product names
    const products = await this.prisma.product.findMany({
      select: { id: true, name: true },
    });

    return result.map((r) => ({
      product_id: r.product_id,
      product_name:
        products.find((p) => p.id === r.product_id)?.name || 'Unknown Product',
      total_nominal: r._sum.nominal || 0,
    }));
  }
}
