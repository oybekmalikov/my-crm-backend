import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles-decorator';
import { DashboardService } from './dashboard.service';
import { AttendanceQueryDto } from './dto/attendance-query.dto';
import { LeadsQueryDto } from './dto/leads-query.dto';

@ApiTags('dashboard')
@Roles('ADMIN', 'SUPERADMIN')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiOperation({
    summary: 'Dashboard overview KPIs',
    description:
      'Returns total active students, total staff, active groups/courses, this month revenue/expense/net balance, overdue payments, and upcoming lessons (next 7 days).',
  })
  @ApiResponse({ status: 200, description: 'Overview data returned.' })
  @Get('overview')
  getOverview() {
    return this.dashboardService.getOverview();
  }

  @ApiOperation({
    summary: 'Attendance rate',
    description:
      'Returns overall or per-group attendance percentage for a given date range.',
  })
  @ApiResponse({ status: 200, description: 'Attendance rate returned.' })
  @Get('attendance')
  getAttendanceRate(@Query() query: AttendanceQueryDto) {
    return this.dashboardService.getAttendanceRate(query);
  }

  @ApiOperation({
    summary: 'Enrollment statistics',
    description:
      'Returns top groups and courses ranked by active student count.',
  })
  @ApiResponse({ status: 200, description: 'Enrollment data returned.' })
  @Get('enrollment')
  getEnrollment() {
    return this.dashboardService.getEnrollment();
  }

  @ApiOperation({
    summary: 'Lead conversion stats',
    description:
      'Returns lead conversion rate (registered / total) and a status breakdown, optionally filtered by date range.',
  })
  @ApiResponse({ status: 200, description: 'Leads stats returned.' })
  @Get('leads')
  getLeads(@Query() query: LeadsQueryDto) {
    return this.dashboardService.getLeads(query);
  }
}
