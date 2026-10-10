import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog, AuditLogDocument } from './entities/audit-log.entity';
import { QueryAuditLogDto } from './dto/query-audit-log.dto';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLogDocument>,
  ) {}

  async create(data: {
    userId?: string;
    userLogin?: string;
    action: string;
    path: string;
    entityType?: string;
    statusCode?: number;
    ip?: string;
    timestamp?: Date;
  }) {
    return this.auditLogModel.create({
      ...data,
      timestamp: data.timestamp ?? new Date(),
    });
  }

  async findAll(query: QueryAuditLogDto) {
    const limit = Math.max(1, parseInt(query.limit ?? '20', 10));
    const page = Math.max(1, parseInt(query.page ?? '1', 10));
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};

    if (query.userId) {
      filter.userId = query.userId;
    }

    if (query.fromDate || query.toDate) {
      filter.timestamp = {};
      if (query.fromDate) filter.timestamp.$gte = new Date(query.fromDate);
      if (query.toDate) filter.timestamp.$lte = new Date(query.toDate);
    }

    const [data, total] = await Promise.all([
      this.auditLogModel
        .find(filter)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.auditLogModel.countDocuments(filter),
    ]);

    return {
      message: 'AUDIT_LOG.LIST_FOUND',
      data: { data, total, page, limit },
      success: true,
    };
  }
}
