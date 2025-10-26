import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { Prisma } from '@prisma/client';

@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  findAll() {
    return this.employeeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(id);
  }

  @Post()
  create(@Body() data: Prisma.EmployeeCreateInput) {
    return this.employeeService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Prisma.EmployeeUpdateInput) {
    return this.employeeService.update(id, data);
  }

  @Delete('id')
  delete(@Param('id') id: string) {
    return this.employeeService.delete(id);
  }
}
