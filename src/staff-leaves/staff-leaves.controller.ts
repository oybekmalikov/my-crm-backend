import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles-decorator';
import { CreateStaffLeaveDto } from './dto/create-staff-leave.dto';
import { DecideStaffLeaveDto } from './dto/decide-staff-leave.dto';
import { StaffLeavesService } from './staff-leaves.service';

@ApiTags('staff-leaves')
@Controller('staff-leaves')
export class StaffLeavesController {
  constructor(private readonly staffLeavesService: StaffLeavesService) {}

  @ApiOperation({ summary: 'Submit a leave request for a staff member' })
  @ApiResponse({ status: 201, description: 'Leave request created' })
  @Roles('SUPERADMIN', 'ADMIN', 'STAFF')
  @Post()
  create(@Body() createStaffLeaveDto: CreateStaffLeaveDto) {
    return this.staffLeavesService.create(createStaffLeaveDto);
  }

  @ApiOperation({ summary: 'List all leave requests (optionally filter by staffId)' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'staffId', required: false, type: String })
  @Roles('SUPERADMIN', 'ADMIN')
  @Get()
  findAll(
    @Query('limit') limit?: number,
    @Query('page') page?: number,
    @Query('staffId') staffId?: string,
  ) {
    return this.staffLeavesService.findAll(+(limit || 10), +(page || 1), staffId);
  }

  @ApiOperation({ summary: "Get a staff member's leave history and balance" })
  @ApiParam({ name: 'staffId', type: 'string', required: true })
  @Roles('SUPERADMIN', 'ADMIN', 'STAFF')
  @Get('balance/:staffId')
  getLeaveBalance(@Param('staffId') staffId: string) {
    return this.staffLeavesService.getLeaveBalance(staffId);
  }

  @ApiOperation({ summary: 'Get a single leave request by ID' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Roles('SUPERADMIN', 'ADMIN', 'STAFF')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staffLeavesService.findOne(id);
  }

  @ApiOperation({ summary: 'Approve or reject a leave request' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Roles('SUPERADMIN', 'ADMIN')
  @Patch(':id/decide')
  decide(@Param('id') id: string, @Body() dto: DecideStaffLeaveDto) {
    return this.staffLeavesService.decide(id, dto);
  }

  @ApiOperation({ summary: 'Delete a leave request' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Roles('SUPERADMIN', 'ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.staffLeavesService.remove(id);
  }
}
