import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@ApiTags('budgets')
@Controller('budgets')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @ApiOperation({ summary: 'Create budget' })
  @ApiResponse({ status: 201, description: 'Created successfully' })
  @Post()
  create(@Body() createBudgetDto: CreateBudgetDto) {
    return this.budgetsService.create(createBudgetDto);
  }

  @ApiOperation({ summary: 'Get all budgets' })
  @ApiResponse({ status: 200, description: 'All records' })
  @Get()
  findAll(
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    return this.budgetsService.findAll(limit, page);
  }

  @ApiOperation({ summary: 'Get budget by ID' })
  @ApiResponse({ status: 200, description: 'Found' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.budgetsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update budget' })
  @ApiResponse({ status: 200, description: 'Updated successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBudgetDto: UpdateBudgetDto) {
    return this.budgetsService.update(id, updateBudgetDto);
  }

  @ApiOperation({ summary: 'Delete budget' })
  @ApiResponse({ status: 200, description: 'Deleted successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.budgetsService.remove(id);
  }
}
