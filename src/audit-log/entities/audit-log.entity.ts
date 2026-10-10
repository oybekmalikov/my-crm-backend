import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type AuditLogDocument = HydratedDocument<AuditLog>;

@Schema({ timestamps: true, collection: 'audit-logs' })
export class AuditLog {
  @ApiProperty({ example: 'user_id_here', description: 'User ID (ObjectId)' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId: string;

  @ApiProperty({ example: 'ali-aliyev', description: 'User login name' })
  @Prop()
  userLogin: string;

  @ApiProperty({ example: 'POST', description: 'HTTP method' })
  @Prop({ required: true })
  action: string;

  @ApiProperty({ example: '/students', description: 'Request path' })
  @Prop({ required: true })
  path: string;

  @ApiProperty({
    example: 'Student',
    description: 'Inferred entity type from path',
  })
  @Prop()
  entityType: string;

  @ApiProperty({ example: 201, description: 'HTTP response status code' })
  @Prop()
  statusCode: number;

  @ApiProperty({ example: '127.0.0.1', description: 'Client IP address' })
  @Prop()
  ip: string;

  @ApiProperty({
    example: '2025-01-01T12:00:00Z',
    description: 'Timestamp of the action',
  })
  @Prop({ type: Date, default: null })
  timestamp: Date | null;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
