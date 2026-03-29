import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StudentsProductsService } from './students-products.service';
import { CreateStudentsProductDto } from './dto/create-students-product.dto';
import { UpdateStudentsProductDto } from './dto/update-students-product.dto';

@Controller('students-products')
export class StudentsProductsController {
  constructor(private readonly studentsProductsService: StudentsProductsService) {}

  @Post()
  create(@Body() createStudentsProductDto: CreateStudentsProductDto) {
    return this.studentsProductsService.create(createStudentsProductDto);
  }

  @Get()
  findAll() {
    return this.studentsProductsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentsProductsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentsProductDto: UpdateStudentsProductDto) {
    return this.studentsProductsService.update(+id, updateStudentsProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentsProductsService.remove(+id);
  }
}
