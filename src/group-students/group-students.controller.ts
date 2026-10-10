import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles-decorator';
import { GroupStudentsService } from './group-students.service';
import { CreateGroupStudentDto } from './dto/create-group-student.dto';
import { UpdateGroupStudentDto } from './dto/update-group-student.dto';

@ApiTags('group-students')
@Controller('group-students')
export class GroupStudentsController {
  constructor(private readonly groupStudentsService: GroupStudentsService) {}

  @ApiOperation({ summary: 'Create a group-student link', description: 'Add a student to a group' })
  @ApiResponse({ status: 201, description: 'Link created successfully' })
  @Roles('SUPERADMIN', 'ADMIN', 'STAFF', 'TEACHER')
  @Post()
  create(@Body() createGroupStudentDto: CreateGroupStudentDto) {
    return this.groupStudentsService.create(createGroupStudentDto);
  }

  @ApiOperation({ summary: 'Get all group-students', description: 'Retrieve a list of group-students' })
  @ApiResponse({ status: 200, description: 'All group-students' })
  @Get()
  findAll(
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    return this.groupStudentsService.findAll(limit, page);
  }

  @ApiOperation({ summary: 'Get group capacity info (available seats)' })
  @ApiParam({ name: 'groupId', type: 'string', required: true })
  @Get('capacity/:groupId')
  getCapacityInfo(@Param('groupId') groupId: string) {
    return this.groupStudentsService.getCapacityInfo(groupId);
  }

  @ApiOperation({ summary: 'Transfer student to another group' })
  @Roles('SUPERADMIN', 'ADMIN', 'STAFF')
  @Post('transfer')
  transferStudent(
    @Body('studentId') studentId: string,
    @Body('fromGroupId') fromGroupId: string,
    @Body('toGroupId') toGroupId: string,
  ) {
    return this.groupStudentsService.transferStudent(studentId, fromGroupId, toGroupId);
  }

  @ApiOperation({ summary: 'Exclude student from group with reason' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Roles('SUPERADMIN', 'ADMIN', 'STAFF', 'TEACHER')
  @Patch(':id/exclude')
  excludeStudent(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @Body('excludedBy') excludedBy: string,
  ) {
    return this.groupStudentsService.excludeStudent(id, reason, excludedBy);
  }

  @ApiOperation({ summary: 'Get group-student by ID' })
  @ApiResponse({ status: 200, description: 'Found' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupStudentsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update group-student' })
  @ApiResponse({ status: 200, description: 'Updated successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Roles('SUPERADMIN', 'ADMIN', 'STAFF', 'TEACHER')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupStudentDto: UpdateGroupStudentDto) {
    return this.groupStudentsService.update(id, updateGroupStudentDto);
  }

  @ApiOperation({ summary: 'Delete group-student' })
  @ApiResponse({ status: 200, description: 'Deleted successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Roles('SUPERADMIN', 'ADMIN', 'STAFF', 'TEACHER')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupStudentsService.remove(id);
  }
}
