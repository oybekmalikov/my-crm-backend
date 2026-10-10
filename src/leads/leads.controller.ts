import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles-decorator';
import { CreateLeadActivityDto } from './dto/create-lead-activity.dto';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { ConvertLeadDto } from './dto/convert-lead.dto';
import { FullEnrollDto } from './dto/full-enroll.dto';

@ApiTags('leads')
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @ApiOperation({ summary: 'Create lead' })
  @ApiResponse({ status: 201, description: 'Created successfully' })
  @Roles('SUPERADMIN', 'ADMIN', 'STAFF')
  @Post()
  create(@Body() createLeadDto: CreateLeadDto) {
    return this.leadsService.create(createLeadDto);
  }

  @ApiOperation({ summary: 'Get all leads' })
  @ApiResponse({ status: 200, description: 'All records' })
  @Get()
  findAll(
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    return this.leadsService.findAll(limit, page);
  }

  @ApiOperation({ summary: 'Check if phone number already exists as active lead' })
  @Get('check-duplicate')
  checkDuplicate(@Query('phone') phone: string) {
    return this.leadsService.checkDuplicate(phone).then((existing) => ({
      message: existing ? 'LEAD.DUPLICATE_FOUND' : 'LEAD.NO_DUPLICATE',
      data: { duplicate: !!existing, lead: existing },
      success: true,
    }));
  }

  @ApiOperation({ summary: '#64 — Lead scoring board (top leads by score)' })
  @Get('scoring/board')
  getScoringBoard(@Query('limit') limit?: number) {
    return this.leadsService.getScoringBoard(limit);
  }

  @ApiOperation({ summary: '#65 — Sales funnel analytics' })
  @Get('analytics/funnel')
  getSalesFunnelAnalytics(
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.leadsService.getSalesFunnelAnalytics(from, to);
  }

  @ApiOperation({ summary: '#67 — Lead source ROI analytics' })
  @Get('analytics/source-roi')
  getLeadSourceRoi(
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.leadsService.getLeadSourceRoi(from, to);
  }

  @ApiOperation({ summary: '#66 — Today follow-up list' })
  @Get('follow-ups/today')
  getTodayFollowUps(@Query('limit') limit?: number) {
    return this.leadsService.getTodayFollowUps(limit);
  }

  @ApiOperation({ summary: '#66 — Trigger follow-up scheduler now' })
  @Roles('SUPERADMIN', 'ADMIN', 'STAFF')
  @Post('follow-ups/run')
  runFollowUpScheduler() {
    return this.leadsService.runFollowUpScheduler();
  }

  @ApiOperation({ summary: '#68 — Send WhatsApp/Telegram lead message' })
  @Roles('SUPERADMIN', 'ADMIN', 'STAFF')
  @Post(':id/send-message')
  sendLeadMessage(
    @Param('id') id: string,
    @Body('channel') channel: 'telegram' | 'whatsapp',
    @Body('template') template: 'trial_invite' | 'payment_reminder' | 'follow_up',
  ) {
    return this.leadsService.sendLeadMessage(id, channel, template);
  }

  @ApiOperation({ summary: 'Send follow-up reminders for stale leads (7+ days)' })
  @Roles('SUPERADMIN', 'ADMIN', 'STAFF')
  @Post('pipeline-reminders')
  runPipelineReminders() {
    return this.leadsService.runPipelineReminders();
  }

  @ApiOperation({ summary: 'Get lead by ID' })
  @ApiResponse({ status: 200, description: 'Found' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leadsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update lead' })
  @ApiResponse({ status: 200, description: 'Updated successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Roles('SUPERADMIN', 'ADMIN', 'STAFF')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLeadDto: UpdateLeadDto) {
    return this.leadsService.update(id, updateLeadDto);
  }

  @ApiOperation({ summary: 'Delete lead' })
  @ApiResponse({ status: 200, description: 'Deleted successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Roles('SUPERADMIN', 'ADMIN', 'STAFF')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leadsService.remove(id);
  }

  @ApiOperation({ summary: 'Convert lead to student', description: 'Creates a User (STUDENT role) + Student record from the lead, marks lead as converted' })
  @ApiResponse({ status: 201, description: 'Converted successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Roles('SUPERADMIN', 'ADMIN')
  @Post(':id/convert')
  convertToStudent(@Param('id') id: string, @Body() convertLeadDto: ConvertLeadDto) {
    return this.leadsService.convertToStudent(id, convertLeadDto);
  }

  @ApiOperation({
    summary: '#31 — Book a trial lesson for a lead',
    description: 'Sets lead status to "trial" and creates a pending attendance record for the next scheduled lesson in the group',
  })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Roles('SUPERADMIN', 'ADMIN', 'STAFF')
  @Post(':id/trial-lesson')
  bookTrialLesson(@Param('id') id: string, @Body('groupId') groupId: string) {
    return this.leadsService.bookTrialLesson(id, groupId);
  }

  @ApiOperation({
    summary: '#32 — Full enrollment pipeline: Lead → User → Student → Contract → Group(s)',
    description: 'One-shot enrollment. Uses CoursePlan pricing (#33) and supports multi-group enrollment (#35).',
  })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Roles('SUPERADMIN', 'ADMIN')
  @Post(':id/full-enroll')
  fullEnroll(@Param('id') id: string, @Body() dto: FullEnrollDto) {
    return this.leadsService.fullEnroll(id, dto);
  }

  @ApiOperation({ summary: '#69 — Add lead activity (call/message/follow-up result)' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Roles('SUPERADMIN', 'ADMIN', 'STAFF')
  @Post(':id/activities')
  addActivity(@Param('id') id: string, @Body() dto: CreateLeadActivityDto) {
    return this.leadsService.addActivity(id, dto);
  }

  @ApiOperation({ summary: '#69 — Get lead activity log' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Get(':id/activities')
  getActivities(@Param('id') id: string, @Query('limit') limit?: number) {
    return this.leadsService.getActivities(id, limit);
  }
}
