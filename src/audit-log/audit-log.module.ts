import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditLog, AuditLogSchema } from './entities/audit-log.entity';
import { AuditLogService } from './audit-log.service';
import { AuditLogController } from './audit-log.controller';
import { AuditLogInterceptor } from './audit-log.interceptor';

// To enable global audit logging, add this to AppModule providers after importing AuditLogModule:
//
//   import { APP_INTERCEPTOR } from '@nestjs/core';
//   import { AuditLogInterceptor } from './audit-log/audit-log.interceptor';
//
//   providers: [
//     { provide: APP_INTERCEPTOR, useClass: AuditLogInterceptor },
//   ]

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AuditLog.name, schema: AuditLogSchema },
    ]),
  ],
  controllers: [AuditLogController],
  providers: [AuditLogService, AuditLogInterceptor],
  exports: [AuditLogService, AuditLogInterceptor],
})
export class AuditLogModule {}
