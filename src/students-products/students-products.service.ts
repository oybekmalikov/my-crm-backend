import { Injectable } from '@nestjs/common';
import { CreateStudentsProductDto } from './dto/create-students-product.dto';
import { UpdateStudentsProductDto } from './dto/update-students-product.dto';

@Injectable()
export class StudentsProductsService {
  create(createStudentsProductDto: CreateStudentsProductDto) {
    return 'This action adds a new studentsProduct';
  }

  findAll() {
    return `This action returns all studentsProducts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} studentsProduct`;
  }

  update(id: number, updateStudentsProductDto: UpdateStudentsProductDto) {
    return `This action updates a #${id} studentsProduct`;
  }

  remove(id: number) {
    return `This action removes a #${id} studentsProduct`;
  }
}
