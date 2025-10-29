import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { EmployeeModule } from './employee/employee.module';
import { TargetModule } from './target/target.module';
import { AchievementModule } from './achievement/achievement.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [PrismaModule, EmployeeModule, TargetModule, AchievementModule, CategoryModule, ProductModule, AnalyticsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
