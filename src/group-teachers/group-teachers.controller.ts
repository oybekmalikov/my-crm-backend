import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GroupTeachersService } from './group-teachers.service';
import { CreateGroupTeacherDto } from './dto/create-group-teacher.dto';
import { UpdateGroupTeacherDto } from './dto/update-group-teacher.dto';

@ApiTags('group-teachers')
@Controller('group-teachers')
export class GroupTeachersController {
  constructor(private readonly groupTeachersService: GroupTeachersService) {}

  @ApiOperation({ summary: 'Create a group-teacher link', description: 'Assign a teacher to a group' })
  @ApiResponse({ status: 201, description: 'Created successfully' })
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
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupTeacherDto: UpdateGroupTeacherDto) {
    return this.groupTeachersService.update(id, updateGroupTeacherDto);
  }

  @ApiOperation({ summary: 'Delete group-teacher' })
  @ApiResponse({ status: 200, description: 'Deleted successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupTeachersService.remove(id);
  }
}
