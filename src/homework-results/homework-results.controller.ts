import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles-decorator';
import { HomeworkResultsService } from './homework-results.service';
import { CreateHomeworkResultDto } from './dto/create-homework-result.dto';
import { UpdateHomeworkResultDto } from './dto/update-homework-result.dto';

@ApiTags('homework-results')
@Controller('homework-results')
export class HomeworkResultsController {
  constructor(private readonly homeworkResultsService: HomeworkResultsService) {}

  @ApiOperation({ summary: 'Create homework result' })
  @ApiResponse({ status: 201, description: 'Created successfully' })
  @Roles('SUPERADMIN', 'ADMIN', 'STAFF', 'TEACHER')
  @Post()
  create(@Body() createHomeworkResultDto: CreateHomeworkResultDto) {
    return this.homeworkResultsService.create(createHomeworkResultDto);
  }

  @ApiOperation({ summary: 'Get all homework results' })
  @ApiResponse({ status: 200, description: 'All homework results' })
  @Get()
  findAll(
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    return this.homeworkResultsService.findAll(limit, page);
  }

  @ApiOperation({ summary: 'Get homework result by ID' })
  @ApiResponse({ status: 200, description: 'Found' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.homeworkResultsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update homework result' })
  @ApiResponse({ status: 200, description: 'Updated successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Roles('SUPERADMIN', 'ADMIN', 'STAFF', 'TEACHER')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHomeworkResultDto: UpdateHomeworkResultDto) {
    return this.homeworkResultsService.update(id, updateHomeworkResultDto);
  }

  @ApiOperation({ summary: 'Delete homework result' })
  @ApiResponse({ status: 200, description: 'Deleted successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Roles('SUPERADMIN', 'ADMIN', 'STAFF', 'TEACHER')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.homeworkResultsService.remove(id);
  }
}
