import { Controller, Get, Param, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('employee/:employeeId/performance')
  getEmployeePerformance(
    @Param('employeeId') employeeId: string,
    @Query('year') year?: string,
  ) {
    const parsedYear = year ? Number(year) : undefined;
    return this.analyticsService.getEmployeePerformance(employeeId, parsedYear);
  }

  @Get('products/targets')
  getProductTargetSummary(@Query('year') year?: string) {
    const parsedYear = year ? Number(year) : undefined;
    return this.analyticsService.getProductTargetSummary(parsedYear);
  }

  // ✅ NEW: Fetch available years dynamically
  @Get('years')
  getAvailableYears() {
    return this.analyticsService.getAvailableYears();
  }

  @Get('summary/monthly')
  getOverallMonthlySummary(@Query('year') year?: string) {
    const parsedYear = year ? Number(year) : undefined;
    return this.analyticsService.getOverallMonthlySummary(parsedYear);
  }

  @Get('employees/top-achievers')
  getTopEmployees(@Query('year') year?: string) {
    const yearNumber = year ? Number(year) : undefined;
    return this.analyticsService.getTopEmployeesByAchievement(yearNumber);
  }
}
