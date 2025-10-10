import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { Event } from "../../events/entities/event.entity"
@Entity({ name: 'students_events' })
export class StudentsEvent {
  @ApiProperty({
    example: 1,
    description: 'This is the user ID number.',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 1,
    description: "This is the student's ID number",
  })
  @Column()
  studentId: number;

  @ApiProperty({
    example: 1,
    description: "This is the event's ID number",
  })
  @Column()
  eventId: number;

  @ApiProperty({
    example: true,
    description: "This is the student's attendance status",
  })
  @Column({ default: false })
  isAttended: boolean;

  @CreateDateColumn()
  createdAt: boolean;

  @ManyToOne(() => Student, (st) => st.events)
  student: Student;
  @ManyToOne(() => Event, (ev) => ev.students)
  event: Event;
}
