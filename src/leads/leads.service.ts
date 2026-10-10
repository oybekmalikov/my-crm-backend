import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';
import {
  Attendance,
  AttendanceDocument,
} from '../attendance/entities/attendance.entity';
import {
  GroupStudent,
  GroupStudentDocument,
} from '../group-students/entities/group-student.entity';
import { Lesson, LessonDocument } from '../lessons/entities/lesson.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { Staff, StaffDocument } from '../staffs/entities/staff.entity';
import {
  StudentsContract,
  StudentsContractDocument,
} from '../students-contracts/entities/students-contract.entity';
import {
  StudentsContractsService,
} from '../students-contracts/students-contracts.service';
import { StudentsService } from '../students/students.service';
import {
  StudentPayment,
  StudentPaymentDocument,
} from '../student-payments/entities/student-payment.entity';
import { UsersService } from '../users/users.service';
import { ConvertLeadDto } from './dto/convert-lead.dto';
import { CreateLeadDto } from './dto/create-lead.dto';
import { FullEnrollDto } from './dto/full-enroll.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { CreateLeadActivityDto } from './dto/create-lead-activity.dto';
import {
  LeadActivity,
  LeadActivityDocument,
} from './entities/lead-activity.entity';
import { Lead, LeadDocument } from './entities/lead.entity';

@Injectable()
export class LeadsService {
  constructor(
    @InjectModel(Lead.name) private leadModel: Model<LeadDocument>,
    @InjectModel(Staff.name) private staffModel: Model<StaffDocument>,
    @InjectModel(Lesson.name) private lessonModel: Model<LessonDocument>,
    @InjectModel(Attendance.name) private attendanceModel: Model<AttendanceDocument>,
    @InjectModel(GroupStudent.name) private groupStudentModel: Model<GroupStudentDocument>,
    @InjectModel(StudentsContract.name) private studentsContractModel: Model<StudentsContractDocument>,
    @InjectModel(StudentPayment.name) private studentPaymentModel: Model<StudentPaymentDocument>,
    @InjectModel(LeadActivity.name) private leadActivityModel: Model<LeadActivityDocument>,
    private readonly usersService: UsersService,
    private readonly studentsService: StudentsService,
    private readonly studentsContractsService: StudentsContractsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(createLeadDto: CreateLeadDto) {
    const duplicate = await this.checkDuplicate(createLeadDto.phone);
    if (duplicate) {
      throw new ConflictException('LEAD.DUPLICATE_PHONE');
    }

    let assignedTo = createLeadDto.assignedTo;
    if (!assignedTo) {
      assignedTo = await this.getNextAssignee();
    }

    const scoreInfo = await this.calculateLeadScore(
      createLeadDto.status ?? 'new',
      createLeadDto.source ?? 'other',
      [],
    );

    const record = await this.leadModel.create({
      ...createLeadDto,
      assignedTo,
      score: scoreInfo.score,
      scoreLevel: scoreInfo.scoreLevel,
      lastActivityAt: null,
    });

    await this.leadActivityModel.create({
      leadId: record._id.toString(),
      type: 'status_change',
      outcome: record.status,
      notes: 'Lead created',
      scoreDelta: scoreInfo.score,
      happenedAt: new Date(),
    });

    return {
      message: 'LEAD.CREATED',
      data: record,
      success: true,
    };
  }

  async checkDuplicate(phone: string) {
    const existing = await this.leadModel.findOne({
      phone,
      status: { $nin: ['converted', 'lost'] },
    }).exec();
    return existing;
  }

  /** Round-robin assignment: pick the active staff member with fewest open leads. */
  private async getNextAssignee(): Promise<string | undefined> {
    const staffMembers = await this.staffModel.find({ isActive: true }).limit(50).exec();
    if (staffMembers.length === 0) return undefined;

    let minCount = Infinity;
    let selected = staffMembers[0]._id.toString();

    for (const staff of staffMembers) {
      const count = await this.leadModel.countDocuments({
        assignedTo: staff._id.toString(),
        status: { $nin: ['converted', 'lost'] },
      });
      if (count < minCount) {
        minCount = count;
        selected = staff._id.toString();
      }
    }
    return selected;
  }

  async runPipelineReminders() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const staleLeads = await this.leadModel
      .find({
        status: { $in: ['new', 'contacted'] },
        updatedAt: { $lt: sevenDaysAgo },
        assignedTo: { $ne: null },
      })
      .exec();

    let notified = 0;
    for (const lead of staleLeads) {
      const staff = await this.staffModel.findById(lead.assignedTo).exec();
      if (!staff) continue;

      await this.notificationsService.createFromTemplate(
        'lead_follow_up',
        staff.userId.toString(),
        {
          leadName: `${lead.firstName} ${lead.lastName ?? ''}`.trim(),
          phone: lead.phone,
        },
      );
      notified++;
    }

    return {
      message: 'LEAD.PIPELINE_REMINDERS_SENT',
      data: { notified },
      success: true,
    };
  }

  @Cron('0 9 * * *')
  async handleDailyFollowUpCron() {
    await this.runFollowUpScheduler();
  }

  async findAll(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
    const data = await this.leadModel
      .find()
      .populate('courseId')
      .populate('assignedTo')
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 })
      .exec();
    const total = await this.leadModel.countDocuments();

    if (data.length === 0) {
      return {
        message: 'LEAD.LIST_EMPTY',
        data: [],
        success: true,
      };
    }
    return {
      message: 'LEAD.LIST_FOUND',
      data: { data, total, page, limit },
      success: true,
    };
  }

  async findOne(id: string) {
    const record = await this.leadModel
      .findById(id)
      .populate('courseId')
      .populate('assignedTo')
      .exec();
    if (!record) {
      throw new NotFoundException('LEAD.NOT_FOUND');
    }
    return {
      message: 'LEAD.FOUND',
      data: record,
      success: true,
    };
  }

  async update(id: string, updateLeadDto: UpdateLeadDto) {
    const existing = await this.leadModel.findById(id).exec();
    if (!existing) {
      throw new NotFoundException('LEAD.NOT_FOUND');
    }

    const record = await this.leadModel.findByIdAndUpdate(id, updateLeadDto, { new: true }).exec();
    if (!record) {
      throw new NotFoundException('LEAD.NOT_FOUND');
    }

    if (updateLeadDto.status && updateLeadDto.status !== existing.status) {
      await this.leadActivityModel.create({
        leadId: id,
        type: 'status_change',
        outcome: `${existing.status} -> ${updateLeadDto.status}`,
        notes: 'Status updated',
        scoreDelta: 0,
        happenedAt: new Date(),
      });
    }

    await this.refreshLeadScore(id);

    return {
      message: 'LEAD.UPDATED',
      data: record,
      success: true,
    };
  }

  async remove(id: string) {
    const deleted = await this.leadModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('LEAD.NOT_FOUND');
    }
    return {
      message: 'LEAD.DELETED',
      data: { affected: 1 },
      success: true,
    };
  }

  async convertToStudent(id: string, convertLeadDto: ConvertLeadDto) {
    const lead = await this.leadModel.findById(id).exec();
    if (!lead) {
      throw new NotFoundException('LEAD.NOT_FOUND');
    }
    if (lead.status === 'converted') {
      throw new ConflictException('LEAD.ALREADY_CONVERTED');
    }

    const phone = convertLeadDto.phone ?? lead.phone;

    let userResult: any;
    try {
      userResult = await this.usersService.create({
        firstName: lead.firstName,
        lastName: lead.lastName ?? '',
        middleName: convertLeadDto.middleName,
        login: convertLeadDto.login,
        password: convertLeadDto.password,
        phone,
        email: convertLeadDto.email,
        role: 'STUDENT',
      });
    } catch (err) {
      throw err;
    }

    const newUser = userResult.data;
    const userId = newUser._id?.toString() ?? newUser.id?.toString();

    let studentResult: any;
    try {
      studentResult = await this.studentsService.create({
        userId,
        dateOfBirth: convertLeadDto.dateOfBirth,
        gender: convertLeadDto.gender,
        address: convertLeadDto.address,
        isActive: true,
      } as any);
    } catch (err) {
      throw err;
    }

    const newStudent = studentResult.data;
    const studentId = newStudent._id?.toString() ?? newStudent.id?.toString();

    const updatedLead = await this.leadModel
      .findByIdAndUpdate(id, { status: 'converted', studentId }, { new: true })
      .exec();

    await this.leadActivityModel.create({
      leadId: id,
      type: 'status_change',
      outcome: 'converted',
      notes: 'Lead converted to student',
      scoreDelta: 0,
      happenedAt: new Date(),
    });

    await this.refreshLeadScore(id);

    return {
      message: 'LEAD.CONVERTED',
      data: { lead: updatedLead, user: newUser, student: newStudent },
      success: true,
    };
  }

  /**
   * #31 — Trial lesson booking.
   * Finds the first lesson for the given group, creates a pending Attendance record for the lead,
   * and marks the lead status as 'trial'.
   */
  async bookTrialLesson(leadId: string, groupId: string) {
    const lead = await this.leadModel.findById(leadId).exec();
    if (!lead) throw new NotFoundException('LEAD.NOT_FOUND');

    if (['converted', 'lost'].includes(lead.status)) {
      throw new BadRequestException('LEAD.CANNOT_BOOK_TRIAL_IN_CURRENT_STATUS');
    }

    // Find the next scheduled lesson in the group
    const lesson = await this.lessonModel
      .findOne({ groupId, status: 'scheduled' })
      .sort({ date: 1 })
      .exec();

    if (!lesson) {
      throw new NotFoundException('LEAD.NO_SCHEDULED_LESSON_IN_GROUP');
    }

    // Create a trial attendance entry (no studentId — lead-only guest entry)
    // We use a placeholder; a real student record is created only after full enrollment
    const trialAttendance = await this.attendanceModel.create({
      groupId,
      lessonId: lesson._id.toString(),
      studentId: lead._id.toString(), // temporary reference — lead ID used as placeholder
      status: 'pending',
      lateMinute: 0,
    });

    // Update lead status to 'trial'
    const updatedLead = await this.leadModel
      .findByIdAndUpdate(leadId, { status: 'trial' }, { new: true })
      .exec();

    await this.leadActivityModel.create({
      leadId,
      type: 'trial',
      outcome: 'booked',
      notes: `Trial booked in group ${groupId}`,
      scoreDelta: 0,
      happenedAt: new Date(),
    });

    await this.refreshLeadScore(leadId);
    await this.sendLeadMessage(leadId, 'telegram', 'trial_invite');

    return {
      message: 'LEAD.TRIAL_BOOKED',
      data: { lead: updatedLead, lesson, trialAttendance },
      success: true,
    };
  }

  /**
   * #32 — Full enrollment pipeline (one API call):
   * Lead → User → Student → StudentsContract → GroupStudent.
   * Also integrates CoursePlan pricing (#33) and allows multi-course enrollment (#35).
   */
  async fullEnroll(leadId: string, dto: FullEnrollDto) {
    const lead = await this.leadModel.findById(leadId).exec();
    if (!lead) throw new NotFoundException('LEAD.NOT_FOUND');
    if (lead.status === 'converted') throw new ConflictException('LEAD.ALREADY_CONVERTED');

    // ── Step 1: Create User ──────────────────────────────────────────────────
    const userResult = await this.usersService.create({
      firstName: lead.firstName,
      lastName: lead.lastName ?? '',
      middleName: dto.middleName,
      login: dto.login,
      password: dto.password,
      phone: dto.phone ?? lead.phone,
      email: dto.email,
      role: 'STUDENT',
    });
    const newUser = userResult.data;
    const userId = newUser._id?.toString() ?? newUser.id?.toString();

    // ── Step 2: Create Student record ────────────────────────────────────────
    const studentResult = await this.studentsService.create({
      userId,
      dateOfBirth: dto.dateOfBirth,
      gender: dto.gender,
      address: dto.address,
      isActive: true,
    } as any);
    const newStudent = studentResult.data;
    const studentId = newStudent._id?.toString() ?? newStudent.id?.toString();

    // ── Step 3: Create StudentsContract with CoursePlan pricing (#33) ────────
    const contractResult = await this.studentsContractsService.createWithPlan({
      studentId,
      contractId: dto.contractId,
      courseId: dto.courseId,
      selectedPlan: dto.selectedPlan,
      coursePlanId: dto.coursePlanId,    // CoursePlan ID for pricing
      customDiscount: dto.customDiscount, // optional override
    });
    const newContract = contractResult.data;

    // ── Step 4: Add to group (supports multi-group enrollment #35) ───────────
    const groupStudents: GroupStudentDocument[] = [];
    for (const groupId of dto.groupIds) {
      // Check existing enrollment in this group to avoid duplicates
      const existing = await this.groupStudentModel.findOne({
        studentId,
        groupId,
        status: { $in: ['studying', 'waitlisted'] },
      }).exec();

      if (!existing) {
        const gs = await this.groupStudentModel.create({
          studentId,
          groupId,
          status: 'studying',
        });
        groupStudents.push(gs);
      }
    }

    // ── Step 5: Mark lead as converted ───────────────────────────────────────
    const updatedLead = await this.leadModel
      .findByIdAndUpdate(leadId, { status: 'converted', studentId }, { new: true })
      .exec();

    await this.leadActivityModel.create({
      leadId,
      type: 'status_change',
      outcome: 'converted',
      notes: 'Lead fully enrolled',
      scoreDelta: 0,
      happenedAt: new Date(),
    });

    await this.refreshLeadScore(leadId);

    return {
      message: 'LEAD.FULLY_ENROLLED',
      data: {
        lead: updatedLead,
        user: newUser,
        student: newStudent,
        contract: newContract,
        groupStudents,
      },
      success: true,
    };
  }

  async addActivity(leadId: string, dto: CreateLeadActivityDto) {
    const lead = await this.leadModel.findById(leadId).exec();
    if (!lead) throw new NotFoundException('LEAD.NOT_FOUND');

    const scoreDelta = this.getActivityScoreDelta(dto.type, dto.outcome);

    const activity = await this.leadActivityModel.create({
      leadId,
      type: dto.type,
      outcome: dto.outcome ?? '',
      notes: dto.notes ?? '',
      actorUserId: dto.actorUserId ?? null,
      scoreDelta,
      happenedAt: dto.happenedAt ? new Date(dto.happenedAt) : new Date(),
    });

    const leadAfterScoreUpdate = await this.refreshLeadScore(leadId);

    return {
      message: 'LEAD.ACTIVITY_CREATED',
      data: { activity, lead: leadAfterScoreUpdate },
      success: true,
    };
  }

  async getActivities(leadId: string, limit = 50) {
    const lead = await this.leadModel.findById(leadId).exec();
    if (!lead) throw new NotFoundException('LEAD.NOT_FOUND');

    const activities = await this.leadActivityModel
      .find({ leadId })
      .sort({ happenedAt: -1, _id: -1 })
      .limit(limit)
      .exec();

    return {
      message: 'LEAD.ACTIVITIES_FOUND',
      data: activities,
      success: true,
    };
  }

  async getScoringBoard(limit = 20) {
    const leads = await this.leadModel
      .find({ status: { $nin: ['lost'] } })
      .sort({ score: -1, updatedAt: -1 })
      .limit(limit)
      .exec();

    return {
      message: 'LEAD.SCORING_BOARD',
      data: leads,
      success: true,
    };
  }

  async getSalesFunnelAnalytics(from?: string, to?: string) {
    const filter: any = {};
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const leads = await this.leadModel.find(filter).select('status').exec();
    const stages = ['new', 'contacted', 'trial', 'registered', 'converted'];
    const counts = stages.reduce((acc, stage) => {
      acc[stage] = 0;
      return acc;
    }, {} as Record<string, number>);

    for (const lead of leads) {
      if (counts[lead.status] !== undefined) {
        counts[lead.status] += 1;
      }
    }

    const safeRate = (num: number, den: number) => (den > 0 ? Number(((num / den) * 100).toFixed(2)) : 0);
    const conversions = {
      new_to_contacted: safeRate(counts.contacted, counts.new),
      contacted_to_trial: safeRate(counts.trial, counts.contacted),
      trial_to_registered: safeRate(counts.registered + counts.converted, counts.trial),
      overall_to_registered: safeRate(counts.registered + counts.converted, counts.new),
    };

    return {
      message: 'LEAD.FUNNEL_ANALYTICS',
      data: {
        counts,
        conversions,
        total: leads.length,
      },
      success: true,
    };
  }

  async getTodayFollowUps(limit = 100) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const leads = await this.leadModel
      .find({
        nextContactDate: { $gte: start, $lt: end },
        status: { $nin: ['lost', 'converted'] },
      })
      .sort({ nextContactDate: 1, score: -1 })
      .limit(limit)
      .populate('assignedTo')
      .exec();

    return {
      message: 'LEAD.TODAY_FOLLOW_UPS',
      data: leads,
      success: true,
    };
  }

  async runFollowUpScheduler() {
    const todayList = await this.getTodayFollowUps(500);
    const leads = todayList.data as LeadDocument[];

    let notified = 0;
    for (const lead of leads) {
      if (!lead.assignedTo) continue;

      const staff = await this.staffModel.findById(lead.assignedTo).exec();
      if (!staff?.userId) continue;

      await this.notificationsService.createFromTemplate(
        'lead_follow_up',
        staff.userId.toString(),
        {
          leadName: `${lead.firstName} ${lead.lastName ?? ''}`.trim(),
          phone: lead.phone,
        },
      );
      notified += 1;
    }

    return {
      message: 'LEAD.FOLLOW_UP_SCHEDULER_DONE',
      data: {
        notified,
        totalDue: leads.length,
      },
      success: true,
    };
  }

  async getLeadSourceRoi(from?: string, to?: string) {
    const filter: any = {};
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const leads = await this.leadModel.find(filter).select('source status studentId').exec();
    const sourceStats: Record<string, { leads: number; converted: number; studentIds: string[] }> = {};

    for (const lead of leads) {
      const source = lead.source ?? 'other';
      if (!sourceStats[source]) {
        sourceStats[source] = { leads: 0, converted: 0, studentIds: [] };
      }
      sourceStats[source].leads += 1;
      if (lead.status === 'converted' || lead.status === 'registered') {
        sourceStats[source].converted += 1;
      }
      if (lead.studentId) {
        sourceStats[source].studentIds.push(lead.studentId.toString());
      }
    }

    const rows = await Promise.all(
      Object.entries(sourceStats).map(async ([source, stats]) => {
        const uniqueStudentIds = [...new Set(stats.studentIds)];

        const contracts = uniqueStudentIds.length
          ? await this.studentsContractModel.find({ studentId: { $in: uniqueStudentIds } }).exec()
          : [];

        const studentPayments = uniqueStudentIds.length
          ? await this.studentPaymentModel
              .find({ studentId: { $in: uniqueStudentIds }, status: { $in: ['completed', 'paid'] } })
              .exec()
          : [];

        const realizedRevenue = studentPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
        const conversionRate = stats.leads > 0 ? Number(((stats.converted / stats.leads) * 100).toFixed(2)) : 0;

        return {
          source,
          leads: stats.leads,
          convertedLeads: stats.converted,
          conversionRate,
          contracts: contracts.length,
          realizedRevenue,
        };
      }),
    );

    rows.sort((a, b) => b.realizedRevenue - a.realizedRevenue || b.convertedLeads - a.convertedLeads);

    return {
      message: 'LEAD.SOURCE_ROI_ANALYTICS',
      data: rows,
      success: true,
    };
  }

  async sendLeadMessage(
    leadId: string,
    channel: 'telegram' | 'whatsapp',
    template: 'trial_invite' | 'payment_reminder' | 'follow_up',
    options?: { skipScoreRefresh?: boolean },
  ) {
    const lead = await this.leadModel.findById(leadId).exec();
    if (!lead) throw new NotFoundException('LEAD.NOT_FOUND');

    const templates: Record<'trial_invite' | 'payment_reminder' | 'follow_up', string> = {
      trial_invite: `Hi ${lead.firstName}, we have reserved your trial lesson. Please confirm your time.`,
      payment_reminder: `Hi ${lead.firstName}, this is a reminder about your pending payment.`,
      follow_up: `Hi ${lead.firstName}, we wanted to follow up and help you choose the best group.`,
    };

    const activity = await this.leadActivityModel.create({
      leadId,
      type: 'message',
      outcome: `${channel}:${template}`,
      notes: templates[template],
      scoreDelta: this.getActivityScoreDelta('message', 'sent'),
      happenedAt: new Date(),
    });

    const updatedLead = options?.skipScoreRefresh ? lead : await this.refreshLeadScore(leadId);

    return {
      message: 'LEAD.MESSAGE_SENT',
      data: {
        channel,
        template,
        lead: updatedLead,
        activity,
      },
      success: true,
    };
  }

  private getActivityScoreDelta(type: string, outcome?: string): number {
    const base: Record<string, number> = {
      call: 8,
      trial: 18,
      website_visit: 5,
      follow_up: 6,
      message: 5,
      note: 2,
      status_change: 0,
    };

    const normalizedOutcome = (outcome ?? '').toLowerCase();
    let delta = base[type] ?? 0;

    if (type === 'call') {
      if (normalizedOutcome.includes('answered')) delta += 3;
      if (normalizedOutcome.includes('no-answer') || normalizedOutcome.includes('rejected')) delta -= 2;
    }

    if (type === 'trial' && normalizedOutcome.includes('attended')) {
      delta += 6;
    }

    return delta;
  }

  private async calculateLeadScore(status: string, source: string, activities: LeadActivityDocument[]) {
    const statusMap: Record<string, number> = {
      new: 5,
      contacted: 20,
      trial: 45,
      registered: 70,
      converted: 90,
      lost: 0,
    };

    const sourceMap: Record<string, number> = {
      telegram: 8,
      instagram: 7,
      website: 10,
      friend: 12,
      other: 4,
    };

    const activityScore = activities.reduce((acc, item) => acc + (item.scoreDelta ?? 0), 0);
    const rawScore = (statusMap[status] ?? 0) + (sourceMap[source] ?? 0) + activityScore;
    const score = Math.max(0, Math.min(100, rawScore));
    const scoreLevel = score >= 70 ? 'hot' : score >= 35 ? 'warm' : 'cold';

    return { score, scoreLevel };
  }

  private async refreshLeadScore(leadId: string) {
    const lead = await this.leadModel.findById(leadId).exec();
    if (!lead) throw new NotFoundException('LEAD.NOT_FOUND');

    const activities = await this.leadActivityModel.find({ leadId }).exec();
    const scoreInfo = await this.calculateLeadScore(lead.status, lead.source, activities);
    const lastActivity = activities
      .sort((a, b) => new Date(b.happenedAt).getTime() - new Date(a.happenedAt).getTime())[0];

    return this.leadModel
      .findByIdAndUpdate(
        leadId,
        {
          score: scoreInfo.score,
          scoreLevel: scoreInfo.scoreLevel,
          lastActivityAt: lastActivity?.happenedAt ?? null,
        },
        { new: true },
      )
      .exec();
  }
}
