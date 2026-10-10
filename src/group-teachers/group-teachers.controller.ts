import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles-decorator';
import { GroupTeachersService } from './group-teachers.service';
import { CreateGroupTeacherDto } from './dto/create-group-teacher.dto';
import { UpdateGroupTeacherDto } from './dto/update-group-teacher.dto';

@ApiTags('group-teachers')
@Controller('group-teachers')
export class GroupTeachersController {
  constructor(private readonly groupTeachersService: GroupTeachersService) {}

  @ApiOperation({ summary: 'Create a group-teacher link', description: 'Assign a teacher to a group' })
  @ApiResponse({ status: 201, description: 'Created successfully' })
  @Roles('SUPERADMIN', 'ADMIN', 'STAFF', 'TEACHER')
  @Post()
  create(@Body() createGroupTeacherDto: CreateGroupTeacherDto) {
    return this.groupTeachersService.create(createGroupTeacherDto);
  }

  @ApiOperation({ summary: 'Get all group-teachers' })
  @ApiResponse({ status: 200, description: 'All group-teachers' })
  @Get()
  findAll(
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    return this.groupTeachersService.findAll(limit, page);
  }

  @ApiOperation({ summary: 'Get group-teacher by ID' })
  @ApiResponse({ status: 200, description: 'Found' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupTeachersService.findOne(id);
  }

  @ApiOperation({ summary: 'Update group-teacher' })
  @ApiResponse({ status: 200, description: 'Updated successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Roles('SUPERADMIN', 'ADMIN', 'STAFF', 'TEACHER')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupTeacherDto: UpdateGroupTeacherDto) {
    return this.groupTeachersService.update(id, updateGroupTeacherDto);
  }

  @ApiOperation({ summary: 'Delete group-teacher' })
  @ApiResponse({ status: 200, description: 'Deleted successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Roles('SUPERADMIN', 'ADMIN', 'STAFF', 'TEACHER')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupTeachersService.remove(id);
  }

  @ApiOperation({ summary: 'Get teacher weekly schedule (#55)' })
  @ApiParam({ name: 'teacherId', type: 'string', required: true })
  @ApiQuery({ name: 'weekStart', required: false, type: 'string', description: 'YYYY-MM-DD for the Monday of the week' })
  @Get('teacher/:teacherId/schedule')
  getWeeklySchedule(
    @Param('teacherId') teacherId: string,
    @Query('weekStart') weekStart?: string,
  ) {
    return this.groupTeachersService.getWeeklySchedule(teacherId, weekStart);
  }

  @ApiOperation({ summary: 'Get teacher monthly workload (#51)' })
  @ApiParam({ name: 'teacherId', type: 'string', required: true })
  @Get('teacher/:teacherId/workload')
  getTeacherWorkload(@Param('teacherId') teacherId: string) {
    return this.groupTeachersService.getTeacherWorkload(teacherId);
  }
}
