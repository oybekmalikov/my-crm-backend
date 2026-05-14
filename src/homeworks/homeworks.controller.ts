import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HomeworksService } from './homeworks.service';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';

@ApiTags('homeworks')
@Controller('homeworks')
export class HomeworksController {
  constructor(private readonly homeworksService: HomeworksService) {}

  @ApiOperation({ summary: 'Create homework' })
  @ApiResponse({ status: 201, description: 'Created successfully' })
  @Post()
  create(@Body() createHomeworkDto: CreateHomeworkDto) {
    return this.homeworksService.create(createHomeworkDto);
  }

  @ApiOperation({ summary: 'Get all homeworks' })
  @ApiResponse({ status: 200, description: 'All homeworks' })
  @Get()
  findAll(
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    return this.homeworksService.findAll(limit, page);
  }

  @ApiOperation({ summary: 'Get homework by ID' })
  @ApiResponse({ status: 200, description: 'Found' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.homeworksService.findOne(id);
  }

  @ApiOperation({ summary: 'Update homework' })
  @ApiResponse({ status: 200, description: 'Updated successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHomeworkDto: UpdateHomeworkDto) {
    return this.homeworksService.update(id, updateHomeworkDto);
  }

  @ApiOperation({ summary: 'Delete homework' })
  @ApiResponse({ status: 200, description: 'Deleted successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.homeworksService.remove(id);
  }
}
