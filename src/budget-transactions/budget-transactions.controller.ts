import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BudgetTransactionsService } from './budget-transactions.service';
import { CreateBudgetTransactionDto } from './dto/create-budget-transaction.dto';
import { UpdateBudgetTransactionDto } from './dto/update-budget-transaction.dto';

@ApiTags('budget-transactions')
@Controller('budget-transactions')
export class BudgetTransactionsController {
  constructor(private readonly budgetTransactionsService: BudgetTransactionsService) {}

  @ApiOperation({ summary: 'Create budget transaction' })
  @ApiResponse({ status: 201, description: 'Created successfully' })
  @Post()
  create(@Body() createBudgetTransactionDto: CreateBudgetTransactionDto) {
    return this.budgetTransactionsService.create(createBudgetTransactionDto);
  }

  @ApiOperation({ summary: 'Get all budget transactions' })
  @ApiResponse({ status: 200, description: 'All records' })
  @Get()
  findAll(
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    return this.budgetTransactionsService.findAll(limit, page);
  }

  @ApiOperation({ summary: 'Get budget transaction by ID' })
  @ApiResponse({ status: 200, description: 'Found' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.budgetTransactionsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update budget transaction' })
  @ApiResponse({ status: 200, description: 'Updated successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBudgetTransactionDto: UpdateBudgetTransactionDto) {
    return this.budgetTransactionsService.update(id, updateBudgetTransactionDto);
  }

  @ApiOperation({ summary: 'Delete budget transaction' })
  @ApiResponse({ status: 200, description: 'Deleted successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.budgetTransactionsService.remove(id);
  }
}
