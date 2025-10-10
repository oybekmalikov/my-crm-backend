import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StudentsEvent } from '../../students_events/entities/students_event.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'students' })
export class Student {
  @ApiProperty({
    example: 1,
    description: 'This is the user ID number.',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 1,
    description: 'This is the students userId number.',
  })
  @Column()
  userId: number;

  @ApiProperty({
    example: '2005-05-15',
    description: 'This is the students date of birth',
  })
  @Column()
  dateOfBirth: string;

  @ApiProperty({
    example: 'male',
    description: 'This is the students gender type',
  })
  @Column()
  gender: string;

  @ApiProperty({
    example: 'Manhattan st-10, New York',
    description: 'This students full address',
  })
  @Column()
  address: string;

  @ApiProperty({
    example: true,
    description: 'This students activity',
  })
  @Column({ default: false })
  isActive: boolean;

  @ApiProperty({
    example: 568,
    description: 'This students xp value',
  })
  @Column({ default: 0 })
  xp: number;

  @ApiProperty({
    example: 10256,
    description: 'This students point value',
  })
  @Column({ default: 0 })
  point: number;

  @ApiProperty({
    example: 56,
    description: 'This students avarage mark: interval 0-100',
  })
  @Column({ default: 0 })
  avarageMark: number;

  @ApiProperty({
    example: 5,
    description: 'This students study level',
  })
  @Column({ default: 1 })
  level: number;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @ManyToOne(() => User, (user) => user.students)
  user: User;
  @OneToMany(() => StudentsEvent, (event) => event.student)
  events: StudentsEvent[];
}
