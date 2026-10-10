import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Roles } from '../common/decorators/roles-decorator';
import { StudentsProductsService } from './students-products.service';
import { CreateStudentsProductDto } from './dto/create-students-product.dto';
import { UpdateStudentsProductDto } from './dto/update-students-product.dto';

@Controller('students-products')
export class StudentsProductsController {
  constructor(private readonly studentsProductsService: StudentsProductsService) {}

  @Roles('SUPERADMIN', 'ADMIN', 'STAFF')
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
    return this.studentsProductsService.findOne(id);
  }

  @Roles('SUPERADMIN', 'ADMIN', 'STAFF')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentsProductDto: UpdateStudentsProductDto) {
    return this.studentsProductsService.update(id, updateStudentsProductDto);
  }

  @Roles('SUPERADMIN', 'ADMIN', 'STAFF')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentsProductsService.remove(id);
  }
}
