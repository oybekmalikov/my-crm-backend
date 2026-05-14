import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StudentHomeworkDatasService } from './student-homework-datas.service';
import { CreateStudentHomeworkDataDto } from './dto/create-student-homework-data.dto';
import { UpdateStudentHomeworkDataDto } from './dto/update-student-homework-data.dto';

@ApiTags('student-homework-datas')
@Controller('student-homework-datas')
export class StudentHomeworkDatasController {
  constructor(private readonly studentHomeworkDatasService: StudentHomeworkDatasService) {}

  @ApiOperation({ summary: 'Create student homework data' })
  @ApiResponse({ status: 201, description: 'Created successfully' })
  @Post()
  create(@Body() createStudentHomeworkDataDto: CreateStudentHomeworkDataDto) {
    return this.studentHomeworkDatasService.create(createStudentHomeworkDataDto);
  }

  @ApiOperation({ summary: 'Get all student homework datas' })
  @ApiResponse({ status: 200, description: 'All student homework datas' })
  @Get()
  findAll(
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    return this.studentHomeworkDatasService.findAll(limit, page);
  }

  @ApiOperation({ summary: 'Get student homework data by ID' })
  @ApiResponse({ status: 200, description: 'Found' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentHomeworkDatasService.findOne(id);
  }

  @ApiOperation({ summary: 'Update student homework data' })
  @ApiResponse({ status: 200, description: 'Updated successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentHomeworkDataDto: UpdateStudentHomeworkDataDto) {
    return this.studentHomeworkDatasService.update(id, updateStudentHomeworkDataDto);
  }

  @ApiOperation({ summary: 'Delete student homework data' })
  @ApiResponse({ status: 200, description: 'Deleted successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentHomeworkDatasService.remove(id);
  }
}
