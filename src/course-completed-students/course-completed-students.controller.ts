import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles-decorator';
import { CourseCompletedStudentsService } from './course-completed-students.service';
import { CreateCourseCompletedStudentDto } from './dto/create-course-completed-student.dto';
import { UpdateCourseCompletedStudentDto } from './dto/update-course-completed-student.dto';

@ApiTags('course-completed-students')
@Controller('course-completed-students')
export class CourseCompletedStudentsController {
  constructor(private readonly courseCompletedStudentsService: CourseCompletedStudentsService) {}

  @ApiOperation({ summary: 'Create course completed student record' })
  @ApiResponse({ status: 201, description: 'Created successfully' })
  @Roles('SUPERADMIN', 'ADMIN', 'STAFF', 'TEACHER')
  @Post()
  create(@Body() createCourseCompletedStudentDto: CreateCourseCompletedStudentDto) {
    return this.courseCompletedStudentsService.create(createCourseCompletedStudentDto);
  }

  @ApiOperation({ summary: 'Get all records' })
  @ApiResponse({ status: 200, description: 'All records' })
  @Get()
  findAll(
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    return this.courseCompletedStudentsService.findAll(limit, page);
  }

  @ApiOperation({ summary: 'Get record by ID' })
  @ApiResponse({ status: 200, description: 'Found' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseCompletedStudentsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update record' })
  @ApiResponse({ status: 200, description: 'Updated successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Roles('SUPERADMIN', 'ADMIN', 'STAFF', 'TEACHER')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseCompletedStudentDto: UpdateCourseCompletedStudentDto) {
    return this.courseCompletedStudentsService.update(id, updateCourseCompletedStudentDto);
  }

  @ApiOperation({ summary: 'Delete record' })
  @ApiResponse({ status: 200, description: 'Deleted successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Roles('SUPERADMIN', 'ADMIN', 'STAFF', 'TEACHER')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseCompletedStudentsService.remove(id);
  }
}
