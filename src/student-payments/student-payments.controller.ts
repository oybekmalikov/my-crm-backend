import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StudentPaymentsService } from './student-payments.service';
import { CreateStudentPaymentDto } from './dto/create-student-payment.dto';
import { UpdateStudentPaymentDto } from './dto/update-student-payment.dto';

@ApiTags('student-payments')
@Controller('student-payments')
export class StudentPaymentsController {
  constructor(private readonly studentPaymentsService: StudentPaymentsService) {}

  @ApiOperation({ summary: 'Create student payment' })
  @ApiResponse({ status: 201, description: 'Created successfully' })
  @Post()
  create(@Body() createStudentPaymentDto: CreateStudentPaymentDto) {
    return this.studentPaymentsService.create(createStudentPaymentDto);
  }

  @ApiOperation({ summary: 'Get all student payments' })
  @ApiResponse({ status: 200, description: 'All records' })
  @Get()
  findAll(
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    return this.studentPaymentsService.findAll(limit, page);
  }

  @ApiOperation({ summary: 'Get student payment by ID' })
  @ApiResponse({ status: 200, description: 'Found' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentPaymentsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update student payment' })
  @ApiResponse({ status: 200, description: 'Updated successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentPaymentDto: UpdateStudentPaymentDto) {
    return this.studentPaymentsService.update(id, updateStudentPaymentDto);
  }

  @ApiOperation({ summary: 'Delete student payment' })
  @ApiResponse({ status: 200, description: 'Deleted successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentPaymentsService.remove(id);
  }
}
