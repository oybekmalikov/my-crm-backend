import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BudgetCategoriesService } from './budget-categories.service';
import { BudgetCategoriesController } from './budget-categories.controller';
import { BudgetCategory, BudgetCategorySchema } from './entities/budget-category.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: BudgetCategory.name, schema: BudgetCategorySchema }]),
  ],
  controllers: [BudgetCategoriesController],
  providers: [BudgetCategoriesService],
  exports: [BudgetCategoriesService],
})
export class BudgetCategoriesModule {}
