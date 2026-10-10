import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BudgetCategoriesService } from './budget-categories.service';
import { CreateBudgetCategoryDto, UpdateBudgetCategoryDto } from './dto/budget-category.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles-decorator';

@ApiTags('Budget Categories')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('budget-categories')
export class BudgetCategoriesController {
  constructor(private readonly budgetCategoriesService: BudgetCategoriesService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new budget category' })
  create(@Body() createBudgetCategoryDto: CreateBudgetCategoryDto) {
    return this.budgetCategoriesService.create(createBudgetCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all budget categories' })
  findAll() {
    return this.budgetCategoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one budget category' })
  findOne(@Param('id') id: string) {
    return this.budgetCategoriesService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Update a budget category' })
  update(@Param('id') id: string, @Body() updateBudgetCategoryDto: UpdateBudgetCategoryDto) {
    return this.budgetCategoriesService.update(id, updateBudgetCategoryDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete a budget category' })
  remove(@Param('id') id: string) {
    return this.budgetCategoriesService.remove(id);
  }
}
