import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStudentsContractDto } from './dto/create-students-contract.dto';
import { UpdateStudentsContractDto } from './dto/update-students-contract.dto';
import { StudentsContract, StudentsContractDocument } from './entities/students-contract.entity';

@Injectable()
export class StudentsContractsService {
  constructor(
    @InjectModel(StudentsContract.name) private studentsContractModel: Model<StudentsContractDocument>,
  ) {}

  async create(createStudentsContractDto: CreateStudentsContractDto) {
    const record = await this.studentsContractModel.create(createStudentsContractDto);
    return {
      message: 'STUDENTS_CONTRACT.CREATED',
      data: record,
      success: true,
    };
  }

  async findAll(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
    const data = await this.studentsContractModel
      .find()
      .populate('studentId')
      .populate('contractId')
      .populate('courseId')
      .skip(skip)
      .limit(limit)
      .sort({ _id: 1 })
      .exec();
    const total = await this.studentsContractModel.countDocuments();

    if (data.length === 0) {
      return {
        message: 'STUDENTS_CONTRACT.LIST_EMPTY',
        data: [],
        success: true,
      };
    }
    return {
      message: 'STUDENTS_CONTRACT.LIST_FOUND',
      data: { data, total, page, limit },
      success: true,
    };
  }

  async findOne(id: string) {
    const record = await this.studentsContractModel
      .findById(id)
      .populate('studentId')
      .populate('contractId')
      .populate('courseId')
      .exec();
    if (!record) {
      throw new NotFoundException('STUDENTS_CONTRACT.NOT_FOUND');
    }
    return {
      message: 'STUDENTS_CONTRACT.FOUND',
      data: record,
      success: true,
    };
  }

  async update(id: string, updateStudentsContractDto: UpdateStudentsContractDto) {
    const record = await this.studentsContractModel
      .findByIdAndUpdate(id, updateStudentsContractDto, { new: true })
      .exec();
    if (!record) {
      throw new NotFoundException('STUDENTS_CONTRACT.NOT_FOUND');
    }
    return {
      message: 'STUDENTS_CONTRACT.UPDATED',
      data: record,
      success: true,
    };
  }

  async remove(id: string) {
    const deleted = await this.studentsContractModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('STUDENTS_CONTRACT.NOT_FOUND');
    }
    return {
      message: 'STUDENTS_CONTRACT.DELETED',
      data: { affected: 1 },
      success: true,
    };
  }
}
