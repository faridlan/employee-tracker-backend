import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Target, Achievement, Prisma } from '@prisma/client';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getEmployeePerformance(employeeId: string, year?: number) {
    const whereClause: Prisma.TargetWhereInput = { employee_id: employeeId };
    if (year !== undefined) {
      whereClause.year = year;
    }

    const targets = (await this.prisma.target.findMany({
      where: whereClause,
      include: { Achievement: true },
      orderBy: [{ year: 'asc' }, { month: 'asc' }],
    })) as (Target & { Achievement: Achievement | null })[];

    return targets.map((t) => {
      const achievementNominal = t.Achievement?.nominal ?? 0;
      const percentage =
        t.nominal > 0 ? (achievementNominal / t.nominal) * 100 : 0;

      return {
        month: `${t.year}-${String(t.month).padStart(2, '0')}`,
        year: t.year,
        target: t.nominal,
        achievement: achievementNominal,
        percentage,
      };
    });
  }

  async getProductTargetSummary(year?: number) {
    // ✅ Typed where filter
    const whereClause: Prisma.TargetWhereInput = {};
    if (year !== undefined) {
      whereClause.year = year;
    }

    const result = await this.prisma.target.groupBy({
      by: ['product_id'],
      _sum: { nominal: true },
      where: whereClause,
    });

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

  async getAvailableYears(): Promise<number[]> {
    const years = await this.prisma.target.findMany({
      distinct: ['year'],
      select: { year: true },
      orderBy: { year: 'asc' },
    });

    return years.map((y) => y.year);
  }

  async getOverallMonthlySummary(year?: number) {
    const whereClause: Prisma.TargetWhereInput = {};
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
      const targetValue = t.nominal;
      const achievementValue = t.Achievement?.nominal ?? 0;

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
          data.target > 0 ? (data.achievement / data.target) * 100 : 0,
      }));
  }

  async getTopEmployeesByAchievement(year?: number) {
    const employees = await this.prisma.employee.findMany({
      include: {
        targets: {
          where: year ? { year } : {}, // 🧠 filter by year if provided
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
          (sum, t) => sum + (t.nominal || 0),
          0,
        );
        const totalAchieved = targets.reduce(
          (sum, t) => sum + (t.Achievement?.nominal || 0),
          0,
        );

        const achievement_rate =
          totalTarget > 0 ? (totalAchieved / totalTarget) * 100 : 0;

        return {
          employee_id: emp.id,
          name: emp.name,
          office_location: emp.office_location,
          total_target: totalTarget,
          total_achievement: totalAchieved,
          achievement_rate: Number(achievement_rate.toFixed(2)),
        };
      })
      .sort((a, b) => b.achievement_rate - a.achievement_rate)
      .slice(0, 5);

    return ranked;
  }
}
