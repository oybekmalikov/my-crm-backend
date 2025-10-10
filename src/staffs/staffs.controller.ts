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
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { StaffsService } from './staffs.service';

@Controller('staffs')
export class StaffsController {
  constructor(private readonly staffService: StaffsService) {}

  @ApiOperation({ summary: 'Update staffs salary' })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated staffs salary',
  })
  @Patch('salary/:id')
  updateSalary(@Param('id') id: string, @Body("newSalary") newSalary: number) {
    return this.staffService.updateStaffsSalary(+id, newSalary);
  }

  @ApiOperation({ summary: 'Update staffs position' })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated staffs position',
  })
  @Patch('position/:id')
  updatePosition(@Param('id') id: string, @Body("newPosition") newPosition: string) {
    return this.staffService.updateStaffsPosition(+id, newPosition);
  }

  @ApiOperation({ summary: 'Set staffs salary to paid' })
  @ApiResponse({
    status: 200,
    description: 'Successfully set staffs salary to paid',
  })
  @Patch('salary/paid/:id')
  setSalaryToPaid(@Param('id') id: string) {
    return this.staffService.setStaffsSalaryToPaid(+id);
  }

  @ApiOperation({
    summary: 'Create a new staff',
    description: 'Create a new staff with the provided details',
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully created a new staff',
  })
  @Post()
  create(@Body() createStaffDto: CreateStaffDto) {
    return this.staffService.create(createStaffDto);
  }

  @ApiOperation({
    summary: 'Get all staffs',
    description: 'Retrieve a list of all staffs',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the list of staffs',
  })
  @Get()
  findAll(@Query('limit') limit: string, @Query('page') page: string) {
    if (!limit) limit = '10';
    if (!page) page = '1';
    return this.staffService.findAll(+limit, +page);
  }

  @ApiOperation({
    summary: 'Get a specific staff by userId',
    description: 'Retrieve details of a specific staff using their userId',
  })
  @ApiResponse({
    status: 200,
    description: "Successfully retrieved the staff's details",
  })
  @Get('user/:id')
  findOneByUserId(@Param('id') id: string) {
    return this.staffService.findOneByUserId(+id);
  }

  @ApiOperation({
    summary: 'Get a specific staff by ID',
    description: 'Retrieve details of a specific staff using their ID',
  })
  @ApiResponse({
    status: 200,
    description: "Successfully retrieved the staff's details",
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staffService.findOne(+id);
  }

  @ApiOperation({
    summary: 'Update a staff by ID',
    description: 'Update the details of a specific staff using their ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated the staff',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatestaffDto: UpdateStaffDto) {
    return this.staffService.update(+id, updatestaffDto);
  }

  @ApiOperation({
    summary: 'Delete a staff by ID',
    description: 'Delete a specific staff using their ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully deleted the staff',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.staffService.remove(+id);
  }
}
