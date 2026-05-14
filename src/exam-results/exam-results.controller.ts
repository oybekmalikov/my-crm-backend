import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ExamResultsService } from './exam-results.service';
import { CreateExamResultDto } from './dto/create-exam-result.dto';
import { UpdateExamResultDto } from './dto/update-exam-result.dto';

@ApiTags('exam-results')
@Controller('exam-results')
export class ExamResultsController {
  constructor(private readonly examResultsService: ExamResultsService) {}

  @ApiOperation({ summary: 'Create exam result' })
  @ApiResponse({ status: 201, description: 'Created successfully' })
  @Post()
  create(@Body() createExamResultDto: CreateExamResultDto) {
    return this.examResultsService.create(createExamResultDto);
  }

  @ApiOperation({ summary: 'Get all exam results' })
  @ApiResponse({ status: 200, description: 'All exam results' })
  @Get()
  findAll(
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    return this.examResultsService.findAll(limit, page);
  }

  @ApiOperation({ summary: 'Get exam result by ID' })
  @ApiResponse({ status: 200, description: 'Found' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examResultsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update exam result' })
  @ApiResponse({ status: 200, description: 'Updated successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExamResultDto: UpdateExamResultDto) {
    return this.examResultsService.update(id, updateExamResultDto);
  }

  @ApiOperation({ summary: 'Delete exam result' })
  @ApiResponse({ status: 200, description: 'Deleted successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.examResultsService.remove(id);
  }
}
