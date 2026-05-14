import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ExamsService } from './exams.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';

@ApiTags('exams')
@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @ApiOperation({ summary: 'Create exam' })
  @ApiResponse({ status: 201, description: 'Created successfully' })
  @Post()
  create(@Body() createExamDto: CreateExamDto) {
    return this.examsService.create(createExamDto);
  }

  @ApiOperation({ summary: 'Get all exams' })
  @ApiResponse({ status: 200, description: 'All exams' })
  @Get()
  findAll(
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    return this.examsService.findAll(limit, page);
  }

  @ApiOperation({ summary: 'Get exam by ID' })
  @ApiResponse({ status: 200, description: 'Found' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update exam' })
  @ApiResponse({ status: 200, description: 'Updated successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExamDto: UpdateExamDto) {
    return this.examsService.update(id, updateExamDto);
  }

  @ApiOperation({ summary: 'Delete exam' })
  @ApiResponse({ status: 200, description: 'Deleted successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.examsService.remove(id);
  }
}
