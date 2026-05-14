import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StudentsWorkingService } from './students-working.service';
import { CreateStudentWorkingDto } from './dto/create-student-working.dto';
import { UpdateStudentWorkingDto } from './dto/update-student-working.dto';

@ApiTags('students-working')
@Controller('students-working')
export class StudentsWorkingController {
  constructor(private readonly studentsWorkingService: StudentsWorkingService) {}

  @ApiOperation({ summary: 'Create student working record' })
  @ApiResponse({ status: 201, description: 'Created successfully' })
  @Post()
  create(@Body() createStudentWorkingDto: CreateStudentWorkingDto) {
    return this.studentsWorkingService.create(createStudentWorkingDto);
  }

  @ApiOperation({ summary: 'Get all working records' })
  @ApiResponse({ status: 200, description: 'All working records' })
  @Get()
  findAll(
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    return this.studentsWorkingService.findAll(limit, page);
  }

  @ApiOperation({ summary: 'Get record by ID' })
  @ApiResponse({ status: 200, description: 'Found' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentsWorkingService.findOne(id);
  }

  @ApiOperation({ summary: 'Update record' })
  @ApiResponse({ status: 200, description: 'Updated successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentWorkingDto: UpdateStudentWorkingDto) {
    return this.studentsWorkingService.update(id, updateStudentWorkingDto);
  }

  @ApiOperation({ summary: 'Delete record' })
  @ApiResponse({ status: 200, description: 'Deleted successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentsWorkingService.remove(id);
  }
}
