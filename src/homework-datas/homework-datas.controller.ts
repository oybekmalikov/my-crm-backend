import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HomeworkDatasService } from './homework-datas.service';
import { CreateHomeworkDataDto } from './dto/create-homework-data.dto';
import { UpdateHomeworkDataDto } from './dto/update-homework-data.dto';

@ApiTags('homework-datas')
@Controller('homework-datas')
export class HomeworkDatasController {
  constructor(private readonly homeworkDatasService: HomeworkDatasService) {}

  @ApiOperation({ summary: 'Create homework data' })
  @ApiResponse({ status: 201, description: 'Created successfully' })
  @Post()
  create(@Body() createHomeworkDataDto: CreateHomeworkDataDto) {
    return this.homeworkDatasService.create(createHomeworkDataDto);
  }

  @ApiOperation({ summary: 'Get all homework datas' })
  @ApiResponse({ status: 200, description: 'All homework datas' })
  @Get()
  findAll(
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    return this.homeworkDatasService.findAll(limit, page);
  }

  @ApiOperation({ summary: 'Get homework data by ID' })
  @ApiResponse({ status: 200, description: 'Found' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.homeworkDatasService.findOne(id);
  }

  @ApiOperation({ summary: 'Update homework data' })
  @ApiResponse({ status: 200, description: 'Updated successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHomeworkDataDto: UpdateHomeworkDataDto) {
    return this.homeworkDatasService.update(id, updateHomeworkDataDto);
  }

  @ApiOperation({ summary: 'Delete homework data' })
  @ApiResponse({ status: 200, description: 'Deleted successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.homeworkDatasService.remove(id);
  }
}
