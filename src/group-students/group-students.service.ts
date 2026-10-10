import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Group, GroupDocument } from '../groups/entities/group.entity';
import { Room, RoomDocument } from '../rooms/entities/room.entity';
import { CreateGroupStudentDto } from './dto/create-group-student.dto';
import { UpdateGroupStudentDto } from './dto/update-group-student.dto';
import { GroupStudent, GroupStudentDocument } from './entities/group-student.entity';

@Injectable()
export class GroupStudentsService {
  constructor(
    @InjectModel(GroupStudent.name) private groupStudentModel: Model<GroupStudentDocument>,
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
  ) {}

  async create(createGroupStudentDto: CreateGroupStudentDto) {
    const group = await this.groupModel.findById(createGroupStudentDto.groupId);
    if (!group) {
      throw new NotFoundException('GROUP_STUDENT.GROUP_NOT_FOUND');
    }

    const room = await this.roomModel.findById(group.roomId);
    if (!room) {
      throw new NotFoundException('GROUP_STUDENT.ROOM_NOT_FOUND');
    }

    const currentStudentsCount = await this.groupStudentModel.countDocuments({
      groupId: createGroupStudentDto.groupId,
      status: 'studying',
    });

    let status = createGroupStudentDto.status ?? 'studying';
    if (currentStudentsCount >= room.capacity && status === 'studying') {
      status = 'waitlisted';
    }

    const groupStudent = await this.groupStudentModel.create({
      ...createGroupStudentDto,
      status,
    });

    return {
      message: status === 'waitlisted' ? 'GROUP_STUDENT.WAITLISTED' : 'GROUP_STUDENT.CREATED',
      data: groupStudent,
      success: true,
    };
  }

  async findAll(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
    const data = await this.groupStudentModel
      .find()
      .populate('groupId')
      .populate('studentId')
      .skip(skip)
      .limit(limit)
      .sort({ _id: 1 })
      .exec();
    const total = await this.groupStudentModel.countDocuments();

    if (data.length === 0) {
      return {
        message: 'GROUP_STUDENT.LIST_EMPTY',
        data: [],
        success: true,
      };
    }
    return {
      message: 'GROUP_STUDENT.LIST_FOUND',
      data: { data, total, page, limit },
      success: true,
    };
  }

  async findOne(id: string) {
    const groupStudent = await this.groupStudentModel.findById(id).populate('groupId').populate('studentId').exec();
    if (!groupStudent) {
      throw new NotFoundException('GROUP_STUDENT.NOT_FOUND');
    }
    return {
      message: 'GROUP_STUDENT.FOUND',
      data: groupStudent,
      success: true,
    };
  }

  async getCapacityInfo(groupId: string) {
    const group = await this.groupModel.findById(groupId).exec();
    if (!group) {
      throw new NotFoundException('GROUP_STUDENT.GROUP_NOT_FOUND');
    }

    const room = await this.roomModel.findById(group.roomId).exec();
    if (!room) {
      throw new NotFoundException('GROUP_STUDENT.ROOM_NOT_FOUND');
    }

    const studying = await this.groupStudentModel.countDocuments({
      groupId,
      status: 'studying',
    });
    const waitlisted = await this.groupStudentModel.countDocuments({
      groupId,
      status: 'waitlisted',
    });

    return {
      message: 'GROUP_STUDENT.CAPACITY_INFO',
      data: {
        groupId,
        capacity: room.capacity,
        studying,
        waitlisted,
        available: Math.max(0, room.capacity - studying),
        isFull: studying >= room.capacity,
      },
      success: true,
    };
  }

  async transferStudent(
    studentId: string,
    fromGroupId: string,
    toGroupId: string,
  ) {
    if (fromGroupId === toGroupId) {
      throw new BadRequestException('GROUP_STUDENT.SAME_GROUP_TRANSFER');
    }

    const existing = await this.groupStudentModel.findOne({
      studentId,
      groupId: fromGroupId,
      status: 'studying',
    }).exec();

    if (!existing) {
      throw new NotFoundException('GROUP_STUDENT.NOT_FOUND_IN_GROUP');
    }

    existing.status = 'excluded';
    existing.exclusionReason = 'Guruhga ko\'chirildi';
    existing.excludedAt = new Date();
    await existing.save();

    const newEnrollment = await this.create({
      groupId: toGroupId,
      studentId,
      status: 'studying',
    });

    await this.groupStudentModel.findByIdAndUpdate(newEnrollment.data._id, {
      transferredFromGroupId: fromGroupId,
    });

    return {
      message: 'GROUP_STUDENT.TRANSFERRED',
      data: newEnrollment.data,
      success: true,
    };
  }

  async excludeStudent(
    id: string,
    reason: string,
    excludedBy: string,
  ) {
    const groupStudent = await this.groupStudentModel.findById(id).exec();
    if (!groupStudent) {
      throw new NotFoundException('GROUP_STUDENT.NOT_FOUND');
    }

    const updated = await this.groupStudentModel
      .findByIdAndUpdate(
        id,
        {
          status: 'excluded',
          exclusionReason: reason,
          excludedAt: new Date(),
          excludedBy,
        },
        { new: true },
      )
      .exec();

    // Promote waitlisted if an active student was excluded
    if (groupStudent.status === 'studying') {
      const earliest = await this.groupStudentModel
        .findOne({ groupId: groupStudent.groupId, status: 'waitlisted' })
        .sort({ createdAt: 1 })
        .exec();
      if (earliest) {
        earliest.status = 'studying';
        await earliest.save();
      }
    }

    return {
      message: 'GROUP_STUDENT.EXCLUDED',
      data: updated,
      success: true,
    };
  }

  async update(id: string, updateGroupStudentDto: UpdateGroupStudentDto) {
    const groupStudent = await this.groupStudentModel
      .findByIdAndUpdate(id, updateGroupStudentDto, { new: true })
      .exec();
    if (!groupStudent) {
      throw new NotFoundException('GROUP_STUDENT.NOT_FOUND');
    }
    return {
      message: 'GROUP_STUDENT.UPDATED',
      data: groupStudent,
      success: true,
    };
  }

  async remove(id: string) {
    const deleted = await this.groupStudentModel.findById(id).exec();
    if (!deleted) {
      throw new NotFoundException('GROUP_STUDENT.NOT_FOUND');
    }

    const groupId = String(deleted.groupId);
    const wasStudying = deleted.status === 'studying';

    await this.groupStudentModel.findByIdAndDelete(id).exec();

    if (wasStudying) {
      const earliest = await this.groupStudentModel
        .findOne({ groupId, status: 'waitlisted' })
        .sort({ createdAt: 1 })
        .exec();

      if (earliest) {
        earliest.status = 'studying';
        await earliest.save();
      }
    }

    return {
      message: 'GROUP_STUDENT.DELETED',
      data: { affected: 1 },
      success: true,
    };
  }
}
