import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Target, Achievement, Prisma } from '@prisma/client';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getEmployeePerformance(
    employeeId: string,
    year?: number,
    productId?: string, // 🆕 optional product filter
  ) {
    const whereClause: Prisma.TargetWhereInput = {
      employee_id: employeeId,
      deleted_at: null, // ✅ exclude soft-deleted
    };

    // 🧭 Add filters if provided
    if (year !== undefined) {
      whereClause.year = year;
    }

    if (productId !== undefined) {
      whereClause.product_id = productId;
    }

    // 🧩 Fetch targets + product + achievement info
    const targets = await this.prisma.target.findMany({
      where: whereClause,
      include: {
        Achievement: true,
        Product: { select: { id: true, name: true } }, // 🆕 include product info
      },
      orderBy: [{ year: 'asc' }, { month: 'asc' }],
    });

    // 🔁 Transform + normalize output
    return targets.map((t) => {
      const targetNominal = Number(t.nominal ?? 0);
      const achievementNominal = Number(t.Achievement?.nominal ?? 0);

      const percentage =
        targetNominal > 0 ? (achievementNominal / targetNominal) * 100 : 0;

      return {
        month: `${t.year}-${String(t.month).padStart(2, '0')}`,
        year: t.year,
        product_id: t.Product?.id ?? null, // 🆕
        product_name: t.Product?.name ?? 'Unknown Product', // 🆕
        target: targetNominal,
        achievement: achievementNominal,
        percentage: Number(percentage.toFixed(2)),
      };
    });
  }

  async getProductTargetSummary(year?: number) {
    const whereClause: Prisma.TargetWhereInput = {
      deleted_at: null,
    };

    if (year !== undefined) {
      whereClause.year = year;
    }

    const result = await this.prisma.target.groupBy({
      by: ['product_id', 'month', 'year'],
      _sum: { nominal: true },
      where: whereClause,
    });

    // Fetch product + category
    const products = await this.prisma.product.findMany({
      select: {
        id: true,
        name: true,
        category: { select: { name: true } }, // ✅ include category
      },
    });

    return result.map((r) => {
      const product = products.find((p) => p.id === r.product_id);
      return {
        product_id: r.product_id,
        product_name: product?.name || 'Unknown Product',
        category_name: product?.category?.name || 'Uncategorized', // ⬅️ NEW FIELD
        month: r.month,
        year: r.year,
        total_nominal: Number(r._sum.nominal ?? 0),
      };
    });
  }

  async getAvailableYears(): Promise<number[]> {
    const years = await this.prisma.target.findMany({
      where: { deleted_at: null }, // ✅ exclude soft-deleted
      distinct: ['year'],
      select: { year: true },
      orderBy: { year: 'asc' },
    });

    return years.map((y) => y.year);
  }

  async getOverallMonthlySummary(year?: number) {
    const whereClause: Prisma.TargetWhereInput = {
      deleted_at: null, // ✅ exclude soft-deleted
    };
    if (year !== undefined) {
      whereClause.year = year;
    }

    const targets = await this.prisma.target.findMany({
      where: whereClause,
      include: { Achievement: true },
    });

    // Group data by month
    const summary = new Map<number, { target: number; achievement: number }>();

    for (const t of targets) {
      const month = t.month;
      const targetValue = Number(t.nominal);
      const achievementValue = Number(t.Achievement?.nominal ?? 0);

      const current = summary.get(month) || { target: 0, achievement: 0 };
      current.target += targetValue;
      current.achievement += achievementValue;
      summary.set(month, current);
    }

    return Array.from(summary.entries())
      .sort(([a], [b]) => a - b)
      .map(([month, data]) => ({
        month,
        target: data.target,
        achievement: data.achievement,
        percentage:
          data.target > 0
            ? Number(((data.achievement / data.target) * 100).toFixed(2))
            : 0,
      }));
  }

  async getTopEmployeesByAchievement(year?: number) {
    const employees = await this.prisma.employee.findMany({
      where: { deleted_at: null },
      include: {
        targets: {
          where: {
            deleted_at: null, // ✅ exclude soft-deleted
            ...(year && { year }),
          },
          include: { Achievement: true },
        },
      },
    });

    const ranked = employees
      .map((emp) => {
        const targets = emp.targets as (Target & {
          Achievement: Achievement | null;
        })[];

        const totalTarget = targets.reduce(
          (sum, t) => sum + Number(t.nominal ?? 0),
          0,
        );
        const totalAchieved = targets.reduce(
          (sum, t) => sum + Number(t.Achievement?.nominal ?? 0),
          0,
        );

        const achievement_rate =
          totalTarget > 0
            ? Number(((totalAchieved / totalTarget) * 100).toFixed(2))
            : 0;

        return {
          employee_id: emp.id,
          name: emp.name,
          office_location: emp.office_location,
          total_target: totalTarget,
          total_achievement: totalAchieved,
          achievement_rate,
        };
      })
      .sort((a, b) => b.achievement_rate - a.achievement_rate)
      .slice(0, 5);

    return ranked;
  }

  async getOverallMonthlySummaryByCategory(year?: number) {
    const whereClause: Prisma.TargetWhereInput = {
      deleted_at: null,
    };
    if (year !== undefined) whereClause.year = year;

    const targets = await this.prisma.target.findMany({
      where: whereClause,
      include: {
        Achievement: true,
        Product: {
          select: {
            id: true,
            name: true,
            category: { select: { name: true } },
          },
        },
      },
    });

    // Group by category → month → totals
    const categoryMap = new Map<
      string,
      Map<number, { target: number; achievement: number }>
    >();

    for (const t of targets) {
      const category = t.Product?.category?.name || 'Uncategorized';
      const month = t.month;

      if (!categoryMap.has(category)) categoryMap.set(category, new Map());
      const monthMap = categoryMap.get(category)!;

      const prev = monthMap.get(month) || { target: 0, achievement: 0 };
      prev.target += Number(t.nominal);
      prev.achievement += Number(t.Achievement?.nominal ?? 0);

      monthMap.set(month, prev);
    }

    // Convert to JSON format
    return Array.from(categoryMap.entries()).map(([category, monthMap]) => ({
      category_name: category,
      months: Array.from(monthMap.entries())
        .sort(([a], [b]) => a - b)
        .map(([month, data]) => ({
          month,
          target: data.target,
          achievement: data.achievement,
          percentage:
            data.target > 0
              ? Number(((data.achievement / data.target) * 100).toFixed(2))
              : 0,
        })),
    }));
  }
}
