import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CoursePlansService } from './course-plans.service';
import { CreateCoursePlanDto } from './dto/create-course-plan.dto';
import { UpdateCoursePlanDto } from './dto/update-course-plan.dto';

@ApiTags('course-plans')
@Controller('course-plans')
export class CoursePlansController {
  constructor(private readonly coursePlansService: CoursePlansService) {}

  @ApiOperation({ summary: 'Create course plan' })
  @ApiResponse({ status: 201, description: 'Created successfully' })
  @Post()
  create(@Body() createCoursePlanDto: CreateCoursePlanDto) {
    return this.coursePlansService.create(createCoursePlanDto);
  }

  @ApiOperation({ summary: 'Get all course plans' })
  @ApiResponse({ status: 200, description: 'All records' })
  @Get()
  findAll(
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    return this.coursePlansService.findAll(limit, page);
  }

  @ApiOperation({ summary: 'Get course plan by ID' })
  @ApiResponse({ status: 200, description: 'Found' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursePlansService.findOne(id);
  }

  @ApiOperation({ summary: 'Update course plan' })
  @ApiResponse({ status: 200, description: 'Updated successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCoursePlanDto: UpdateCoursePlanDto) {
    return this.coursePlansService.update(id, updateCoursePlanDto);
  }

  @ApiOperation({ summary: 'Delete course plan' })
  @ApiResponse({ status: 200, description: 'Deleted successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coursePlansService.remove(id);
  }
}
