import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'staffs' })
export class Staff {
  @ApiProperty({
    example: 1,
    description: 'This is the user ID number.',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 68,
    description: "This is the user's ID from users table",
  })
  @Column()
  userId: number;

  @ApiProperty({
    example: '2005-05-15',
    description: "This is the staff's date of birth",
  })
  @Column()
  dateOfBirth: string;

  @ApiProperty({
    example: 'Bringham 67, New York',
    description: "This is the staff's address",
  })
  @Column()
  address: string;

  @ApiProperty({
    example: 'male',
    description: "This is the staff's gender type",
  })
  @Column()
  gender: string;

  @ApiProperty({
    example: 5000000,
    description: "This is the staff's salary",
  })
  @Column()
  salary: number;

  @ApiProperty({
    example: true,
    description: 'This is the salary paid for last month or not',
  })
  @Column({ default: false })
  salary_paid_for_last_month: boolean;

  @ApiProperty({
    example: 'Manager',
    description: "This is the staff's position",
  })
  @Column({ unique: true })
  position: string;

  @ApiProperty({
    example: true,
    description: "This is the staff's activity status",
  })
  @Column({ default: false })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: boolean;
  @UpdateDateColumn()
  updatedAt: boolean;

  @ManyToOne(() => User, (user) => user.staffs)
  user: User;
}
