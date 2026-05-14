import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WorkerPaymentsService } from './worker-payments.service';
import { CreateWorkerPaymentDto } from './dto/create-worker-payment.dto';
import { UpdateWorkerPaymentDto } from './dto/update-worker-payment.dto';

@ApiTags('worker-payments')
@Controller('worker-payments')
export class WorkerPaymentsController {
  constructor(private readonly workerPaymentsService: WorkerPaymentsService) {}

  @ApiOperation({ summary: 'Create worker payment' })
  @ApiResponse({ status: 201, description: 'Created successfully' })
  @Post()
  create(@Body() createWorkerPaymentDto: CreateWorkerPaymentDto) {
    return this.workerPaymentsService.create(createWorkerPaymentDto);
  }

  @ApiOperation({ summary: 'Get all worker payments' })
  @ApiResponse({ status: 200, description: 'All records' })
  @Get()
  findAll(
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    return this.workerPaymentsService.findAll(limit, page);
  }

  @ApiOperation({ summary: 'Get worker payment by ID' })
  @ApiResponse({ status: 200, description: 'Found' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workerPaymentsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update worker payment' })
  @ApiResponse({ status: 200, description: 'Updated successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkerPaymentDto: UpdateWorkerPaymentDto) {
    return this.workerPaymentsService.update(id, updateWorkerPaymentDto);
  }

  @ApiOperation({ summary: 'Delete worker payment' })
  @ApiResponse({ status: 200, description: 'Deleted successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workerPaymentsService.remove(id);
  }
}
