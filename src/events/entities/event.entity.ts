import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StudentsEvent } from "../../students_events/entities/students_event.entity"

@Entity({ name: 'events' })
export class Event {
  @ApiProperty({
    example: 1,
    description: 'This is the user ID number.',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'The way to learn programming',
    description: "This is the event's title",
  })
  @Column()
  title: string;

  @ApiProperty({
    example: 'At this event you will learn ways to learn programming.',
    description: "This is the event's description",
  })
  @Column()
  description: string;

  @ApiProperty({
    example: 'Ryan Dahl',
    description: "This is the guest's full name",
  })
  @Column()
  guestFullName: string;

  @ApiProperty({
    example: 'Ryan Dahl is the creator of Node.js',
    description: "This is the guest's description",
  })
  @Column()
  guestDescription: string;

  @ApiProperty({
    example: 'https://example.com/guest-picture.jpg',
    description: "This is the guest's picture URL",
  })
  @Column()
  guestPictureUrl: string;

  @ApiProperty({
    example: 300,
    description: 'This is the number of total places for the event',
  })
  @Column({ default: 0 })
  totalPlaces: number;

  @ApiProperty({
    example: 150,
    description: 'This is the number of available places for the event',
  })
  @Column({ unique: true })
  availablePlaces: string;

  @ApiProperty({
    example: '10.10.2025',
    description: "This is the event's date",
  })
  @Column()
  date: string;
  @ApiProperty({
    example: '18:00',
    description: "This is the event's time",
  })
  @Column()
  time: string;

  @ApiProperty({
    example: 50,
    description: "This is the event's point for event",
  })
  @Column()
  pointForEvent: number;

  @ApiProperty({
    example: 'Scheduled',
    description: "This is the event's status",
  })
  @Column()
  status: string;

  @CreateDateColumn()
  createdAt: boolean;

  @OneToMany(() => StudentsEvent, (stev) => stev.event)
  students: Event[];
}
