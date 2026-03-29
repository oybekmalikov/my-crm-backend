import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentsService } from './students.service';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @ApiOperation({
    summary: 'Update student xp and point',
    description: 'Update student experience points and points by ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated student xp and points',
  })
  @Patch('update-xp-point/:id')
  updateXP_Points(
    @Param('id') id: string,
    @Body('xp') added_xp: number,
    @Body('point') added_point: number,
  ) {
    return this.studentsService.updateXP_Points(id, added_xp, added_point);
  }

  @ApiOperation({
    summary: 'Create a new student',
    description: 'Create a new student with the provided details',
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully created a new student',
  })
  @Post()
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @ApiOperation({
    summary: 'Get all students',
    description: 'Retrieve a list of all students',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the list of students',
  })
  @Get()
  findAll(@Query('limit') limit: string, @Query('page') page: string) {
    if (!limit) limit = '10';
    if (!page) page = '1';
    return this.studentsService.findAll(+limit, +page);
  }

  @ApiOperation({
    summary: 'Get a specific student by userId',
    description: 'Retrieve details of a specific student using their userId',
  })
  @ApiResponse({
    status: 200,
    description: "Successfully retrieved the student's details",
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  @Get('user/:id')
  findOneByUserId(@Param('id') id: string) {
    return this.studentsService.findOneByUserId(id);
  }

  @ApiOperation({
    summary: 'Get a specific student by ID',
    description: 'Retrieve details of a specific student using their ID',
  })
  @ApiResponse({
    status: 200,
    description: "Successfully retrieved the student's details",
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update a student by ID',
    description: 'Update the details of a specific student using their ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated the student',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(id, updateStudentDto);
  }

  @ApiOperation({
    summary: 'Delete a student by ID',
    description: 'Delete a specific student using their ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully deleted the student',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentsService.remove(id);
  }
}
