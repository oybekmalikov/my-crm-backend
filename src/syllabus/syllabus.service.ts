import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSyllabusDto, UpdateSyllabusDto } from './dto/syllabus.dto';
import { Syllabus, SyllabusDocument } from './entities/syllabus.entity';

@Injectable()
export class SyllabusService {
  constructor(
    @InjectModel(Syllabus.name) private syllabusModel: Model<SyllabusDocument>,
  ) {}

  async create(createSyllabusDto: CreateSyllabusDto) {
    const syllabus = await this.syllabusModel.create(createSyllabusDto);
    return {
      message: 'SYLLABUS.CREATED',
      data: syllabus,
      success: true,
    };
  }

  async findAll(query: any) {
    const filter = query.courseId ? { courseId: query.courseId } : {};
    const data = await this.syllabusModel
      .find(filter)
      .sort({ order: 1 })
      .exec();
    return {
      message: 'SYLLABUS.LIST',
      data,
      success: true,
    };
  }

  async findOne(id: string) {
    const syllabus = await this.syllabusModel.findById(id).exec();
    if (!syllabus) throw new NotFoundException('SYLLABUS.NOT_FOUND');
    return {
      message: 'SYLLABUS.FOUND',
      data: syllabus,
      success: true,
    };
  }

  async update(id: string, updateSyllabusDto: UpdateSyllabusDto) {
    const syllabus = await this.syllabusModel.findByIdAndUpdate(id, updateSyllabusDto, { new: true }).exec();
    if (!syllabus) throw new NotFoundException('SYLLABUS.NOT_FOUND');
    return {
      message: 'SYLLABUS.UPDATED',
      data: syllabus,
      success: true,
    };
  }

  async remove(id: string) {
    const deleted = await this.syllabusModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('SYLLABUS.NOT_FOUND');
    return {
      message: 'SYLLABUS.DELETED',
      data: { affected: 1 },
      success: true,
    };
  }
}
