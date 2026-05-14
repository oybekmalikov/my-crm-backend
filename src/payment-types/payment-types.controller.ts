import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaymentTypesService } from './payment-types.service';
import { CreatePaymentTypeDto } from './dto/create-payment-type.dto';
import { UpdatePaymentTypeDto } from './dto/update-payment-type.dto';

@ApiTags('payment-types')
@Controller('payment-types')
export class PaymentTypesController {
  constructor(private readonly paymentTypesService: PaymentTypesService) {}

  @ApiOperation({ summary: 'Create payment type' })
  @ApiResponse({ status: 201, description: 'Created successfully' })
  @Post()
  create(@Body() createPaymentTypeDto: CreatePaymentTypeDto) {
    return this.paymentTypesService.create(createPaymentTypeDto);
  }

  @ApiOperation({ summary: 'Get all payment types' })
  @ApiResponse({ status: 200, description: 'All records' })
  @Get()
  findAll(
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    return this.paymentTypesService.findAll(limit, page);
  }

  @ApiOperation({ summary: 'Get payment type by ID' })
  @ApiResponse({ status: 200, description: 'Found' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentTypesService.findOne(id);
  }

  @ApiOperation({ summary: 'Update payment type' })
  @ApiResponse({ status: 200, description: 'Updated successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentTypeDto: UpdatePaymentTypeDto) {
    return this.paymentTypesService.update(id, updatePaymentTypeDto);
  }

  @ApiOperation({ summary: 'Delete payment type' })
  @ApiResponse({ status: 200, description: 'Deleted successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentTypesService.remove(id);
  }
}
