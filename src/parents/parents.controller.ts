import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles-decorator';
import { CreateParentDto } from './dto/create-parent.dto';
import { UpdateParentDto } from './dto/update-parent.dto';
import { ParentsService } from './parents.service';

@ApiTags('parents')
@Controller('parents')
export class ParentsController {
  constructor(private readonly parentsService: ParentsService) {}

  @ApiOperation({ summary: '#70 — Create parent account' })
  @Roles('SUPERADMIN', 'ADMIN', 'STAFF')
  @Post()
  create(@Body() dto: CreateParentDto) {
    return this.parentsService.create(dto);
  }

  @ApiOperation({ summary: 'List parents' })
  @Get()
  findAll(@Query('limit') limit?: number, @Query('page') page?: number) {
    return this.parentsService.findAll(limit, page);
  }

  @ApiOperation({ summary: 'Get parent by id' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.parentsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update parent' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Roles('SUPERADMIN', 'ADMIN', 'STAFF')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateParentDto) {
    return this.parentsService.update(id, dto);
  }

  @ApiOperation({ summary: '#71 — Link student to parent' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @ApiParam({ name: 'studentId', type: 'string', required: true })
  @Roles('SUPERADMIN', 'ADMIN', 'STAFF')
  @Post(':id/students/:studentId')
  addStudent(@Param('id') id: string, @Param('studentId') studentId: string) {
    return this.parentsService.addStudent(id, studentId);
  }

  @ApiOperation({ summary: '#72 — Weekly parent report' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Get(':id/weekly-report')
  getWeeklyReport(@Param('id') id: string) {
    return this.parentsService.getWeeklyReport(id);
  }

  @ApiOperation({ summary: '#73 — Parent risk notifications preview' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Get(':id/notifications-preview')
  getRiskNotificationsPreview(@Param('id') id: string) {
    return this.parentsService.getRiskNotificationsPreview(id);
  }
}
