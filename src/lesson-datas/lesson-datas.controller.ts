import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LessonDatasService } from './lesson-datas.service';
import { CreateLessonDataDto } from './dto/create-lesson-data.dto';
import { UpdateLessonDataDto } from './dto/update-lesson-data.dto';

@ApiTags('lesson-datas')
@Controller('lesson-datas')
export class LessonDatasController {
  constructor(private readonly lessonDatasService: LessonDatasService) {}

  @ApiOperation({ summary: 'Create lesson data', description: 'Add new lesson data' })
  @ApiResponse({ status: 201, description: 'Created successfully' })
  @Post()
  create(@Body() createLessonDataDto: CreateLessonDataDto) {
    return this.lessonDatasService.create(createLessonDataDto);
  }

  @ApiOperation({ summary: 'Get all lesson datas' })
  @ApiResponse({ status: 200, description: 'All lesson datas' })
  @Get()
  findAll(
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    return this.lessonDatasService.findAll(limit, page);
  }

  @ApiOperation({ summary: 'Get lesson data by ID' })
  @ApiResponse({ status: 200, description: 'Found' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonDatasService.findOne(id);
  }

  @ApiOperation({ summary: 'Update lesson data' })
  @ApiResponse({ status: 200, description: 'Updated successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLessonDataDto: UpdateLessonDataDto) {
    return this.lessonDatasService.update(id, updateLessonDataDto);
  }

  @ApiOperation({ summary: 'Delete lesson data' })
  @ApiResponse({ status: 200, description: 'Deleted successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonDatasService.remove(id);
  }
}
