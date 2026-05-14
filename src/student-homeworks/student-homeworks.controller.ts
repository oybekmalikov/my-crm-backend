import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StudentHomeworksService } from './student-homeworks.service';
import { CreateStudentHomeworkDto } from './dto/create-student-homework.dto';
import { UpdateStudentHomeworkDto } from './dto/update-student-homework.dto';

@ApiTags('student-homeworks')
@Controller('student-homeworks')
export class StudentHomeworksController {
  constructor(private readonly studentHomeworksService: StudentHomeworksService) {}

  @ApiOperation({ summary: 'Create student homework' })
  @ApiResponse({ status: 201, description: 'Created successfully' })
  @Post()
  create(@Body() createStudentHomeworkDto: CreateStudentHomeworkDto) {
    return this.studentHomeworksService.create(createStudentHomeworkDto);
  }

  @ApiOperation({ summary: 'Get all student homeworks' })
  @ApiResponse({ status: 200, description: 'All student homeworks' })
  @Get()
  findAll(
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    return this.studentHomeworksService.findAll(limit, page);
  }

  @ApiOperation({ summary: 'Get student homework by ID' })
  @ApiResponse({ status: 200, description: 'Found' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentHomeworksService.findOne(id);
  }

  @ApiOperation({ summary: 'Update student homework' })
  @ApiResponse({ status: 200, description: 'Updated successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentHomeworkDto: UpdateStudentHomeworkDto) {
    return this.studentHomeworksService.update(id, updateStudentHomeworkDto);
  }

  @ApiOperation({ summary: 'Delete student homework' })
  @ApiResponse({ status: 200, description: 'Deleted successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentHomeworksService.remove(id);
  }
}
