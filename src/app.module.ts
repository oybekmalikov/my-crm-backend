import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AttendanceModule } from './attendance/attendance.module';
import { AuditLogModule } from './audit-log/audit-log.module';
import { AuthModule } from './auth/auth.module';
import { BranchesModule } from './branches/branches.module';
import { BudgetCategoriesModule } from './budget-categories/budget-categories.module';
import { BudgetTransactionsModule } from './budget-transactions/budget-transactions.module';
import { BudgetsModule } from './budgets/budgets.module';
import { AuthGuard } from './common/guards/auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { envValidationSchema } from './config/env.validation';
import { ContractsModule } from './contracts/contracts.module';
import { CourseCompletedStudentsModule } from './course-completed-students/course-completed-students.module';
import { CoursePlansModule } from './course-plans/course-plans.module';
import { CoursesModule } from './courses/courses.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { DiscountsModule } from './discounts/discounts.module';
import { EventsModule } from './events/events.module';
import { ExamResultsModule } from './exam-results/exam-results.module';
import { ExamsModule } from './exams/exams.module';
import { GroupStudentsModule } from './group-students/group-students.module';
import { GroupTeachersModule } from './group-teachers/group-teachers.module';
import { GroupsModule } from './groups/groups.module';
import { HomeworkDatasModule } from './homework-datas/homework-datas.module';
import { HomeworkResultsModule } from './homework-results/homework-results.module';
import { HomeworksModule } from './homeworks/homeworks.module';
import { LeadsModule } from './leads/leads.module';
import { LessonDatasModule } from './lesson-datas/lesson-datas.module';
import { LessonsModule } from './lessons/lessons.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ParentsModule } from './parents/parents.module';
import { PaymentTypesModule } from './payment-types/payment-types.module';
import { ProductsModule } from './products/products.module';
import { RoomsModule } from './rooms/rooms.module';
import { StaffLeavesModule } from './staff-leaves/staff-leaves.module';
import { StaffsModule } from './staffs/staffs.module';
import { SyllabusModule } from './syllabus/syllabus.module';
import { StudentHomeworkDatasModule } from './student-homework-datas/student-homework-datas.module';
import { StudentHomeworksModule } from './student-homeworks/student-homeworks.module';
import { StudentPaymentsModule } from './student-payments/student-payments.module';
import { StudentsContractsModule } from './students-contracts/students-contracts.module';
import { StudentsProductsModule } from './students-products/students-products.module';
import { StudentsWorkingModule } from './students-working/students-working.module';
import { StudentsModule } from './students/students.module';
import { StudentsEventsModule } from './students_events/students_events.module';
import { SupportModule } from './support/support.module';
import { UsersModule } from './users/users.module';
import { WorkerContractsModule } from './worker-contracts/worker-contracts.module';
import { WorkerPaymentsModule } from './worker-payments/worker-payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validationSchema: envValidationSchema,
      validationOptions: { abortEarly: false },
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
      }),
    }),
    // Sane default rate limit for every route; auth endpoints override this
    // with a tighter limit (see AuthController).
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 120,
      },
    ]),
    ScheduleModule.forRoot(),
    UsersModule,
    AuthModule,
    StaffsModule,
    StudentsModule,
    EventsModule,
    StudentsEventsModule,
    ProductsModule,
    StudentsProductsModule,
    SupportModule,
    NotificationsModule,
    ParentsModule,
    CoursesModule,
    GroupsModule,
    GroupStudentsModule,
    GroupTeachersModule,
    BranchesModule,
    RoomsModule,
    LessonsModule,
    LessonDatasModule,
    AttendanceModule,
    HomeworksModule,
    HomeworkDatasModule,
    StudentHomeworksModule,
    StudentHomeworkDatasModule,
    HomeworkResultsModule,
    ExamsModule,
    ExamResultsModule,
    CourseCompletedStudentsModule,
    StudentsWorkingModule,
    ContractsModule,
    CoursePlansModule,
    StudentsContractsModule,
    StudentPaymentsModule,
    WorkerContractsModule,
    WorkerPaymentsModule,
    BudgetsModule,
    PaymentTypesModule,
    BudgetCategoriesModule,
    BudgetTransactionsModule,
    LeadsModule,
    DashboardModule,
    AuditLogModule,
    StaffLeavesModule,
    SyllabusModule,
    DiscountsModule,
  ],
  controllers: [],
  providers: [
    // Order matters: rate limiting first, then authentication, then
    // role-based authorization. Applied globally so every new controller is
    // protected by default; opt out per-route with `@Public()`.
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
