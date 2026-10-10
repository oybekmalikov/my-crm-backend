import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles-decorator';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@ApiTags('lessons')
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @ApiOperation({ summary: 'Create a lesson', description: 'Add a new lesson' })
  @ApiResponse({ status: 201, description: 'Lesson created successfully' })
  @Roles('SUPERADMIN', 'ADMIN', 'STAFF', 'TEACHER')
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

  @ApiOperation({ summary: 'Close a lesson – marks absent any student with no/pending attendance' })
  @ApiResponse({ status: 200, description: 'Lesson closed' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Roles('SUPERADMIN', 'ADMIN', 'STAFF', 'TEACHER')
  @Post(':id/close')
  closeLesson(@Param('id') id: string) {
    return this.lessonsService.closeLesson(id);
  }

  @ApiOperation({ summary: 'Get a student attendance percentage in a group' })
  @ApiParam({ name: 'groupId', type: 'string', required: true })
  @ApiParam({ name: 'studentId', type: 'string', required: true })
  @Get('attendance-percentage/:groupId/:studentId')
  getAttendancePercentage(
    @Param('groupId') groupId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.lessonsService.getAttendancePercentage(groupId, studentId);
  }

  @ApiOperation({ summary: 'Cancel a lesson with reason' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Roles('SUPERADMIN', 'ADMIN', 'STAFF', 'TEACHER')
  @Patch(':id/cancel')
  cancelLesson(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @Body('cancelledBy') cancelledBy: string,
  ) {
    return this.lessonsService.cancelLesson(id, reason, cancelledBy);
  }

  @ApiOperation({ summary: 'Reschedule a lesson to a new date/time' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Roles('SUPERADMIN', 'ADMIN', 'STAFF', 'TEACHER')
  @Patch(':id/reschedule')
  rescheduleLesson(
    @Param('id') id: string,
    @Body('date') date: string,
    @Body('startTime') startTime: string,
    @Body('endTime') endTime: string,
    @Body('rescheduledBy') rescheduledBy: string,
  ) {
    return this.lessonsService.rescheduleLesson(id, date, startTime, endTime, rescheduledBy);
  }

  @ApiOperation({ summary: 'Assign substitute teacher for a lesson' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Roles('SUPERADMIN', 'ADMIN', 'STAFF', 'TEACHER')
  @Patch(':id/substitute')
  assignSubstitute(
    @Param('id') id: string,
    @Body('substituteTeacherId') substituteTeacherId: string,
  ) {
    return this.lessonsService.assignSubstituteTeacher(id, substituteTeacherId);
  }

  @ApiOperation({ summary: 'Update lesson' })
  @ApiResponse({ status: 200, description: 'Lesson updated successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Roles('SUPERADMIN', 'ADMIN', 'STAFF', 'TEACHER')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto) {
    return this.lessonsService.update(id, updateLessonDto);
  }

  @ApiOperation({ summary: 'Delete lesson' })
  @ApiResponse({ status: 200, description: 'Lesson deleted successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Roles('SUPERADMIN', 'ADMIN', 'STAFF', 'TEACHER')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonsService.remove(id);
  }
}
