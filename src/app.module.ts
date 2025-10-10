import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from "./auth/auth.module"
import { StaffsModule } from './staffs/staffs.module';
import { StudentsModule } from './students/students.module';
import { EventsModule } from './events/events.module';
import { StudentsEventsModule } from './students_events/students_events.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        type: config.get<'postgres'>('DB_CONNECTION'),
        host: config.get<string>('DB_HOST'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        port: config.get<number>('DB_PORT'),
        database: config.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        autoLoadEntities: true,
        logging: false,
      }),
    }),
    UsersModule,
    AuthModule,
    StaffsModule,
    StudentsModule,
    EventsModule,
    StudentsEventsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
