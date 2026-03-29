import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CreateStudentsEventDto } from './dto/create-students_event.dto';
import { UpdateStudentsEventDto } from './dto/update-students_event.dto';
import { StudentsEventsService } from './students_events.service';

@Controller('students-events')
export class StudentsEventsController {
  constructor(private readonly studentsEventsService: StudentsEventsService) {}

  @ApiOperation({
    summary: 'Set student attended',
    description: 'Set student attended',
  })
  @ApiResponse({ status: 200, type: Object })
  @Patch('attendence/:id')
  setStudentAttended(
    @Param('id') id: string,
    @Body('isAttended') isAttended: boolean,
  ) {
    return this.studentsEventsService.setStudentAttended(id, isAttended);
  }
  @ApiOperation({
    summary: 'Create student event',
    description: 'Create student event',
  })
  @ApiResponse({ status: 200, type: CreateStudentsEventDto })
  @Post()
  create(@Body() createStudentsEventDto: CreateStudentsEventDto) {
    return this.studentsEventsService.create(createStudentsEventDto);
  }

  @ApiOperation({
    summary: 'Get all student events',
    description: 'Get all student events',
  })
  @ApiResponse({ status: 200, type: [CreateStudentsEventDto] })
  @Get()
  findAll() {
    return this.studentsEventsService.findAll();
  }

  @ApiOperation({
    summary: 'Get student event by id',
    description: 'Get student event by id',
  })
  @ApiResponse({ status: 200, type: CreateStudentsEventDto })
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentsEventsService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update student event by id',
    description: 'Update student event by id',
  })
  @ApiResponse({ status: 200, type: UpdateStudentsEventDto })
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStudentsEventDto: UpdateStudentsEventDto,
  ) {
    return this.studentsEventsService.update(id, updateStudentsEventDto);
  }

  @ApiOperation({
    summary: 'Delete student event by id',
    description: 'Delete student event by id',
  })
  @ApiResponse({ status: 200, type: Object })
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentsEventsService.remove(id);
  }
}
