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
    NotificationsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
