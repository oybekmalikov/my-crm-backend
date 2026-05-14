import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @ApiOperation({ summary: 'Create a course', description: 'Add a new course' })
  @ApiResponse({ status: 201, description: 'Course created successfully' })
  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @ApiOperation({ summary: 'Get all courses', description: 'Retrieve a list of courses' })
  @ApiResponse({ status: 200, description: 'All courses' })
  @Get()
  findAll(
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    return this.coursesService.findAll(limit, page);
  }

  @ApiOperation({ summary: 'Get course by ID' })
  @ApiResponse({ status: 200, description: 'Course found' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @ApiOperation({ summary: 'Update course' })
  @ApiResponse({ status: 200, description: 'Course updated successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @ApiOperation({ summary: 'Delete course' })
  @ApiResponse({ status: 200, description: 'Course deleted successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }
}
