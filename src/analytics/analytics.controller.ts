import { Controller, Get, Param } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('employee/:employeeId/performance')
  getEmployeePerformance(@Param('employeeId') employeeId: string) {
    return this.analyticsService.getEmployeePerformance(employeeId);
  }

  @Get('products/targets')
  getProductTargetSummary() {
    return this.analyticsService.getProductTargetSummary();
  }
}
