import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from "./auth/auth.module"
import { StaffsModule } from './staffs/staffs.module';
import { StudentsModule } from './students/students.module';
import { EventsModule } from './events/events.module';
import { StudentsEventsModule } from './students_events/students_events.module';
import { ProductsModule } from './products/products.module';
import { StudentsProductsModule } from './students-products/students-products.module';
import { SupportModule } from './support/support.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AccountSettingsModule } from './account_settings/account_settings.module';
import { CoursesModule } from './courses/courses.module';
import { GroupsModule } from './groups/groups.module';
import { GroupStudentsModule } from './group-students/group-students.module';
import { GroupTeachersModule } from './group-teachers/group-teachers.module';
import { BranchesModule } from './branches/branches.module';
import { RoomsModule } from './rooms/rooms.module';
import { LessonsModule } from './lessons/lessons.module';
import { LessonDatasModule } from './lesson-datas/lesson-datas.module';
import { AttendanceModule } from './attendance/attendance.module';
import { HomeworksModule } from './homeworks/homeworks.module';
import { HomeworkDatasModule } from './homework-datas/homework-datas.module';
import { StudentHomeworksModule } from './student-homeworks/student-homeworks.module';
import { StudentHomeworkDatasModule } from './student-homework-datas/student-homework-datas.module';
import { HomeworkResultsModule } from './homework-results/homework-results.module';
import { ExamsModule } from './exams/exams.module';
import { ExamResultsModule } from './exam-results/exam-results.module';
import { CourseCompletedStudentsModule } from './course-completed-students/course-completed-students.module';
import { StudentsWorkingModule } from './students-working/students-working.module';

import { ContractsModule } from './contracts/contracts.module';
import { CoursePlansModule } from './course-plans/course-plans.module';
import { StudentsContractsModule } from './students-contracts/students-contracts.module';
import { StudentPaymentsModule } from './student-payments/student-payments.module';
import { WorkerContractsModule } from './worker-contracts/worker-contracts.module';
import { WorkerPaymentsModule } from './worker-payments/worker-payments.module';
import { BudgetsModule } from './budgets/budgets.module';
import { PaymentTypesModule } from './payment-types/payment-types.module';
import { BudgetTransactionsModule } from './budget-transactions/budget-transactions.module';
import { LeadsModule } from './leads/leads.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
      }),
    }),
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
    AccountSettingsModule,
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
    BudgetTransactionsModule,
    LeadsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
