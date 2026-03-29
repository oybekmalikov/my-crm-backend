import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type EventDocument = HydratedDocument<Event>;

@Schema({ timestamps: true, collection: 'events' })
export class Event {
  @ApiProperty({
    example: 'The way to learn programming',
    description: "This is the event's title",
  })
  @Prop({ required: true })
  title: string;

  @ApiProperty({
    example: 'At this event you will learn ways to learn programming.',
    description: "This is the event's description",
  })
  @Prop({ required: true })
  description: string;

  @ApiProperty({
    example: 'Ryan Dahl',
    description: "This is the guest's full name",
  })
  @Prop({ required: true })
  guestFullName: string;

  @ApiProperty({
    example: 'Ryan Dahl is the creator of Node.js',
    description: "This is the guest's description",
  })
  @Prop({ required: true })
  guestDescription: string;

  @ApiProperty({
    example: 'https://example.com/guest-picture.jpg',
    description: "This is the guest's picture URL",
  })
  @Prop({ required: true })
  guestPictureUrl: string;

  @ApiProperty({
    example: 300,
    description: 'This is the number of total places for the event',
  })
  @Prop({ default: 0 })
  totalPlaces: number;

  @ApiProperty({
    example: 150,
    description: 'This is the number of available places for the event',
  })
  @Prop({ unique: true, required: true })
  availablePlaces: string;

  @ApiProperty({
    example: '10.10.2025',
    description: "This is the event's date",
  })
  @Prop({ required: true })
  date: string;

  @ApiProperty({ example: '18:00', description: "This is the event's time" })
  @Prop({ required: true })
  time: string;

  @ApiProperty({
    example: 50,
    description: "This is the event's point for event",
  })
  @Prop({ required: true })
  pointForEvent: number;

  @ApiProperty({
    example: 'Scheduled',
    description: "This is the event's status",
  })
  @Prop({ required: true })
  status: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);

EventSchema.virtual('students', {
  ref: 'StudentsEvent',
  localField: '_id',
  foreignField: 'eventId',
});

EventSchema.set('toJSON', { virtuals: true });
EventSchema.set('toObject', { virtuals: true });
