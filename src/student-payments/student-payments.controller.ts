import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles-decorator';
import { StudentPaymentsService } from './student-payments.service';
import { CreateStudentPaymentDto } from './dto/create-student-payment.dto';
import { UpdateStudentPaymentDto } from './dto/update-student-payment.dto';

@ApiTags('student-payments')
@Controller('student-payments')
export class StudentPaymentsController {
  constructor(private readonly studentPaymentsService: StudentPaymentsService) {}

  @ApiOperation({ summary: 'Create student payment' })
  @ApiResponse({ status: 201, description: 'Created successfully' })
  @Roles('SUPERADMIN', 'ADMIN', 'STAFF')
  @Post()
  create(@Body() createStudentPaymentDto: CreateStudentPaymentDto) {
    return this.studentPaymentsService.create(createStudentPaymentDto);
  }

  @ApiOperation({ summary: 'Accept payment in one step (amount, type, date, receipt)' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Roles('SUPERADMIN', 'ADMIN', 'STAFF')
  @Post(':id/accept')
  acceptPayment(
    @Param('id') id: string,
    @Body() body: { amount: number; paymentType: string; paymentDate?: Date; notes?: string },
  ) {
    return this.studentPaymentsService.acceptPayment(id, body);
  }

  @ApiOperation({ summary: 'Get next pending payment for a student' })
  @ApiParam({ name: 'studentId', type: 'string', required: true })
  @Get('student/:studentId/next')
  getNextPayment(@Param('studentId') studentId: string) {
    return this.studentPaymentsService.getNextPaymentForStudent(studentId);
  }

  @ApiOperation({ summary: 'Trigger overdue payment check — marks overdue, notifies students' })
  @ApiResponse({ status: 200, description: 'Overdue check completed' })
  @Roles('SUPERADMIN', 'ADMIN')
  @Post('overdue-check')
  runOverdueCheck() {
    return this.studentPaymentsService.runOverdueCheck();
  }

  @ApiOperation({ summary: 'Get all student payments' })
  @ApiResponse({ status: 200, description: 'All records' })
  @Get()
  findAll(
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    return this.studentPaymentsService.findAll(limit, page);
  }

  @ApiOperation({ summary: 'Get student payment by ID' })
  @ApiResponse({ status: 200, description: 'Found' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentPaymentsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update student payment' })
  @ApiResponse({ status: 200, description: 'Updated successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Roles('SUPERADMIN', 'ADMIN', 'STAFF')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentPaymentDto: UpdateStudentPaymentDto) {
    return this.studentPaymentsService.update(id, updateStudentPaymentDto);
  }

  @ApiOperation({
    summary: '#43 — Manually trigger upcoming payment reminders (3-day notice)',
    description: 'Sends notification + email to students with payments due within 3 days. Also runs automatically via daily cron at 09:00.',
  })
  @Roles('SUPERADMIN', 'ADMIN')
  @Post('send-reminders')
  sendUpcomingPaymentReminders() {
    return this.studentPaymentsService.sendUpcomingPaymentReminders();
  }

  @ApiOperation({
    summary: '#45 — Record a partial payment',
    description: 'Accepts a partial amount, marks the original installment as completed for that amount, and creates a new pending record for the remainder.',
  })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Roles('SUPERADMIN', 'ADMIN', 'STAFF')
  @Post(':id/partial')
  partialPayment(
    @Param('id') id: string,
    @Body() body: { paidAmount: number; paymentType: string; paymentDate?: Date; notes?: string },
  ) {
    return this.studentPaymentsService.partialPayment(id, body);
  }

  @ApiOperation({
    summary: '#46 — Refund a completed payment',
    description: 'Updates payment status to refunded, records reason, and creates an expense budget transaction.',
  })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Roles('SUPERADMIN', 'ADMIN')
  @Post(':id/refund')
  refundPayment(
    @Param('id') id: string,
    @Body('refundReason') refundReason: string,
  ) {
    return this.studentPaymentsService.refundPayment(id, refundReason);
  }

  @ApiOperation({ summary: 'Delete student payment' })
  @ApiResponse({ status: 200, description: 'Deleted successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Roles('SUPERADMIN', 'ADMIN', 'STAFF')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentPaymentsService.remove(id);
  }
}
