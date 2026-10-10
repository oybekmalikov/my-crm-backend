import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles-decorator';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@ApiTags('attendance')
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @ApiOperation({ summary: 'Create attendance' })
  @ApiResponse({ status: 201, description: 'Created successfully' })
  @Roles('SUPERADMIN', 'ADMIN', 'STAFF', 'TEACHER')
  @Post()
  create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.create(createAttendanceDto);
  }

  @ApiOperation({ summary: 'Get all attendances' })
  @ApiResponse({ status: 200, description: 'All attendances' })
  @Get()
  findAll(
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    return this.attendanceService.findAll(limit, page);
  }

  @ApiOperation({ summary: 'Get attendance by ID' })
  @ApiResponse({ status: 200, description: 'Found' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attendanceService.findOne(id);
  }

  @ApiOperation({ summary: 'Get all attendances for a specific group' })
  @ApiParam({ name: 'groupId', type: 'string', required: true })
  @Get('group/:groupId')
  findByGroup(
    @Param('groupId') groupId: string,
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    return this.attendanceService.findByGroup(groupId, limit, page);
  }

  @ApiOperation({ summary: 'Get a specific student attendances in a group' })
  @ApiParam({ name: 'groupId', type: 'string', required: true })
  @ApiParam({ name: 'studentId', type: 'string', required: true })
  @Get('group/:groupId/student/:studentId')
  findByStudentInGroup(
    @Param('groupId') groupId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.attendanceService.findByStudentInGroup(groupId, studentId);
  }

  @ApiOperation({ summary: 'Update attendance' })
  @ApiResponse({ status: 200, description: 'Updated successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Roles('SUPERADMIN', 'ADMIN', 'STAFF', 'TEACHER')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAttendanceDto: UpdateAttendanceDto) {
    return this.attendanceService.update(id, updateAttendanceDto);
  }

  @ApiOperation({ summary: 'Batch update attendance (teacher marking attendance)' })
  @ApiResponse({ status: 200, description: 'Batch updated successfully' })
  @Roles('SUPERADMIN', 'ADMIN', 'STAFF', 'TEACHER')
  @Post('batch-update')
  batchUpdate(@Body() body: { records: { id: string; status: string; lateMinute?: number }[] }) {
    return this.attendanceService.batchUpdate(body.records);
  }

  @ApiOperation({ summary: 'Mark all students in a lesson with the same attendance status' })
  @ApiResponse({ status: 200, description: 'All records marked' })
  @ApiParam({ name: 'lessonId', type: 'string', required: true })
  @Roles('SUPERADMIN', 'ADMIN', 'STAFF', 'TEACHER')
  @Post('batch-mark-group/:lessonId')
  batchMarkGroup(
    @Param('lessonId') lessonId: string,
    @Body('status') status: string,
  ) {
    return this.attendanceService.batchMarkGroup(lessonId, status);
  }

  @ApiOperation({ summary: 'Delete attendance' })
  @ApiResponse({ status: 200, description: 'Deleted successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Roles('SUPERADMIN', 'ADMIN', 'STAFF', 'TEACHER')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attendanceService.remove(id);
  }
}
