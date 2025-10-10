import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RolesType } from '../../@types';
import { Staff } from '../../staffs/entities/staff.entity';
import { Student } from '../../students/entities/student.entity';

@Entity({ name: 'users' })
export class User {
  @ApiProperty({
    example: 1,
    description: 'This is the user ID number.',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Ali',
    description: "This is the user's first name",
  })
  @Column()
  firstName: string;

  @ApiProperty({
    example: 'Aliyev',
    description: "This is the user's last name",
  })
  @Column()
  lastName: string;

  @ApiProperty({
    example: 'Aliyevich',
    description: "This is the user's middle name",
  })
  @Column()
  middleName: string;

  @ApiProperty({
    example: 'ali-aliyev',
    description: "This user's login name",
  })
  @Column({ unique: true })
  login: string;

  @ApiProperty({
    example: 'example1234',
    description: "This user's password",
  })
  @Column()
  password: string;

  @ApiProperty({
    example: '+998991234567',
    description: "This user's phone number",
  })
  @Column({ unique: true })
  phone: string;

  @ApiProperty({
    example: 'user',
    description: "This user's role",
  })
  @Column()
  role: RolesType;

  @ApiProperty({
    example: '/src/something/avatar.jpg',
    description: "This user's avatar path.",
  })
  @Column({ default: '' })
  avatarUrl: string;

  @ApiProperty({
    example: true,
    description: "This user's activity",
  })
  @Column({ default: false })
  isActive: boolean;

  @ApiProperty({
    example: '2023-01-01 12:00:00',
    description: "This user's last activity",
  })
  @Column({ default: '' })
  lastLogin?: string;

  @ApiProperty({
    example: 'qwertyu.12345.!@#$%^&*',
    description: "This is the user's token.",
  })
  @Column({ default: '' })
  refreshToken: string;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Student, (student) => student.user, { onDelete: 'CASCADE' })
  students: Student[];
  @OneToMany(() => Staff, (staff) => staff.user, { onDelete: 'CASCADE' })
  staffs: Staff[];
}
