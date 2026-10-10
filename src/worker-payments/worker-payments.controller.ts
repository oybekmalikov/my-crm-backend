import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles-decorator';
import { WorkerPaymentsService } from './worker-payments.service';
import { CreateWorkerPaymentDto } from './dto/create-worker-payment.dto';
import { UpdateWorkerPaymentDto } from './dto/update-worker-payment.dto';

@ApiTags('worker-payments')
@Controller('worker-payments')
export class WorkerPaymentsController {
  constructor(private readonly workerPaymentsService: WorkerPaymentsService) {}

  @ApiOperation({ summary: 'Create worker payment' })
  @ApiResponse({ status: 201, description: 'Created successfully' })
  @Roles('SUPERADMIN', 'ADMIN', 'STAFF')
  @Post()
  create(@Body() createWorkerPaymentDto: CreateWorkerPaymentDto) {
    return this.workerPaymentsService.create(createWorkerPaymentDto);
  }

  @ApiOperation({ summary: 'Generate monthly payroll for all active worker contracts' })
  @Roles('SUPERADMIN', 'ADMIN')
  @Post('payroll/generate-all')
  generatePayrollForAll(
    @Body('year') year?: number,
    @Body('month') month?: number,
  ) {
    return this.workerPaymentsService.generateMonthlyPayrollForAll(year, month);
  }

  @ApiOperation({ summary: 'Generate monthly payroll for a specific worker contract' })
  @ApiParam({ name: 'contractId', type: 'string', required: true })
  @Roles('SUPERADMIN', 'ADMIN')
  @Post('payroll/generate/:contractId')
  generatePayrollForContract(
    @Param('contractId') contractId: string,
    @Body('year') year?: number,
    @Body('month') month?: number,
  ) {
    return this.workerPaymentsService.generateMonthlyPayrollForContract(contractId, year, month);
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
  @Roles('SUPERADMIN', 'ADMIN', 'STAFF')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkerPaymentDto: UpdateWorkerPaymentDto) {
    return this.workerPaymentsService.update(id, updateWorkerPaymentDto);
  }

  @ApiOperation({ summary: 'Delete worker payment' })
  @ApiResponse({ status: 200, description: 'Deleted successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Roles('SUPERADMIN', 'ADMIN', 'STAFF')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workerPaymentsService.remove(id);
  }
}
