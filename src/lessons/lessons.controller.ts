import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@ApiTags('lessons')
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @ApiOperation({ summary: 'Create a lesson', description: 'Add a new lesson' })
  @ApiResponse({ status: 201, description: 'Lesson created successfully' })
  @Post()
  create(@Body() createLessonDto: CreateLessonDto) {
    return this.lessonsService.create(createLessonDto);
  }

  @ApiOperation({ summary: 'Get all lessons' })
  @ApiResponse({ status: 200, description: 'All lessons' })
  @Get()
  findAll(
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    return this.lessonsService.findAll(limit, page);
  }

  @ApiOperation({ summary: 'Get lesson by ID' })
  @ApiResponse({ status: 200, description: 'Lesson found' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update lesson' })
  @ApiResponse({ status: 200, description: 'Lesson updated successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto) {
    return this.lessonsService.update(id, updateLessonDto);
  }

  @ApiOperation({ summary: 'Delete lesson' })
  @ApiResponse({ status: 200, description: 'Lesson deleted successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonsService.remove(id);
  }
}
