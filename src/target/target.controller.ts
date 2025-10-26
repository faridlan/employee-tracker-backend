import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { TargetService } from './target.service';
import { CreateTargetDto } from './dto/create-target.dto';

@Controller('targets')
export class TargetController {
  constructor(private readonly targetService: TargetService) {}

  @Post()
  create(@Body() dto: CreateTargetDto) {
    return this.targetService.create(dto);
  }

  @Get()
  findAll() {
    return this.targetService.findAll();
  }

  @Get('employee/:employeeId')
  async findByEmployeeId(@Param('employeeId') employeeId: string) {
    const targets = await this.targetService.findByEmployeeId(employeeId);
    if (!targets.length) {
      throw new NotFoundException('No targets found for this employee');
    }
    return targets;
  }
}
