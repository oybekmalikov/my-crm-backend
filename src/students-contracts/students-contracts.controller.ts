import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StudentsContractsService } from './students-contracts.service';
import { CreateStudentsContractDto } from './dto/create-students-contract.dto';
import { UpdateStudentsContractDto } from './dto/update-students-contract.dto';

@ApiTags('students-contracts')
@Controller('students-contracts')
export class StudentsContractsController {
  constructor(private readonly studentsContractsService: StudentsContractsService) {}

  @ApiOperation({ summary: 'Create student contract' })
  @ApiResponse({ status: 201, description: 'Created successfully' })
  @Post()
  create(@Body() createStudentsContractDto: CreateStudentsContractDto) {
    return this.studentsContractsService.create(createStudentsContractDto);
  }

  @ApiOperation({ summary: 'Get all student contracts' })
  @ApiResponse({ status: 200, description: 'All records' })
  @Get()
  findAll(
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    return this.studentsContractsService.findAll(limit, page);
  }

  @ApiOperation({ summary: 'Get student contract by ID' })
  @ApiResponse({ status: 200, description: 'Found' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentsContractsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update student contract' })
  @ApiResponse({ status: 200, description: 'Updated successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentsContractDto: UpdateStudentsContractDto) {
    return this.studentsContractsService.update(id, updateStudentsContractDto);
  }

  @ApiOperation({ summary: 'Delete student contract' })
  @ApiResponse({ status: 200, description: 'Deleted successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentsContractsService.remove(id);
  }
}
