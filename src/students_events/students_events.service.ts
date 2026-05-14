import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StudentsService } from '../students/students.service';
import { CreateStudentsEventDto } from './dto/create-students_event.dto';
import { UpdateStudentsEventDto } from './dto/update-students_event.dto';
import {
  StudentsEvent,
  StudentsEventDocument,
} from './entities/students_event.entity';

@Injectable()
export class StudentsEventsService {
  constructor(
    @InjectModel(StudentsEvent.name)
    private studentsEventModel: Model<StudentsEventDocument>,
    private readonly studentsService: StudentsService,
  ) {}

  async create(createStudentsEventDto: CreateStudentsEventDto) {
    const studentEvent = await this.studentsEventModel.create(
      createStudentsEventDto,
    );
    return {
      message: 'STUDENT_EVENT.CREATED',
      data: studentEvent,
      success: true,
    };
  }

  async findAll(
    limit: number = 10,
    page: number = 1,
    isAttended?: boolean,
    eventStatus?: string,
  ) {
    const skip = (page - 1) * limit;
    const query: any = {};
    if (isAttended !== undefined) {
      query.isAttended = isAttended;
    }

    const data = await this.studentsEventModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ _id: 1 })
      .exec();

    let finalData = data;
    if (eventStatus) {
      finalData = data.filter(
        (se: any) => se.event && se.event.status === eventStatus,
      );
    }

    if (finalData.length === 0) {
      return {
        message: 'STUDENT_EVENT.LIST_EMPTY',
        data: [],
        success: true,
      };
    }
    return {
      message: 'STUDENT_EVENT.LIST_FOUND',
      data: { studentsEvent: finalData, total: finalData.length, page, limit },
      success: true,
    };
  }

  async findOne(id: string) {
    const studentEvent = await this.studentsEventModel
      .findById(id)
      .populate('student')
      .populate('event')
      .exec();
    if (!studentEvent) {
      throw new NotFoundException('STUDENT_EVENT.NOT_FOUND');
    }
    return {
      message: 'STUDENT_EVENT.FOUND',
      data: studentEvent,
      success: true,
    };
  }

  async findByStudentOrEventId(studentId?: string, eventId?: string) {
    const query: any = {};
    if (studentId) query.studentId = studentId;
    if (eventId) query.eventId = eventId;
    console.log(query);
    const thisEvent = await this.studentsEventModel
      .find(query)
      .populate('student')
      .populate('event')
      .exec();
    if (!thisEvent) {
      throw new NotFoundException('STUDENT_EVENT.NOT_FOUND');
    }
    return {
      message: 'STUDENT_EVENT.FOUND',
      data: thisEvent,
      success: true,
    };
  }

  async update(id: string, updateStudentsEventDto: UpdateStudentsEventDto) {
    const studentEvent = await this.studentsEventModel
      .findByIdAndUpdate(id, updateStudentsEventDto, { new: true })
      .exec();
    if (!studentEvent) {
      throw new NotFoundException('STUDENT_EVENT.NOT_FOUND');
    }
    return {
      message: 'STUDENT_EVENT.UPDATED',
      data: studentEvent,
      success: true,
    };
  }

  async remove(id: string) {
    const deleted = await this.studentsEventModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('STUDENT_EVENT.NOT_FOUND');
    }
    return {
      message: 'STUDENT_EVENT.DELETED',
      data: { affected: 1 },
      success: true,
    };
  }

  async setStudentAttended(id: string, isAttended: boolean) {
    const studentEvent = await this.studentsEventModel
      .findById(id)
      .populate('student')
      .populate('event')
      .exec();
    if (!studentEvent) {
      throw new NotFoundException('STUDENT_EVENT.NOT_FOUND');
    }
    studentEvent.isAttended = isAttended;
    await studentEvent.save();

    const doc: any = studentEvent;
    if (isAttended && doc.student && doc.event) {
      await this.studentsService.updateXP_Points(
        doc.student._id?.toString() || doc.student.id?.toString(),
        0,
        doc.event.pointForEvent,
      );
    }
    return {
      message: 'STUDENT_EVENT.UPDATED',
      data: studentEvent,
      success: true,
    };
  }
}
