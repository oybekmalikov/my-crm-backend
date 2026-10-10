import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';
import { Roles } from '../common/decorators/roles-decorator';
import { StudentsContractsService } from './students-contracts.service';
import { CreateStudentsContractDto } from './dto/create-students-contract.dto';
import { UpdateStudentsContractDto } from './dto/update-students-contract.dto';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

class ChangePlanDto {
  @ApiProperty({ example: 'monthly', enum: ['monthly', 'half', 'full'] })
  @IsEnum(['monthly', 'half', 'full'])
  newPlan: 'monthly' | 'half' | 'full';

  @ApiPropertyOptional({ example: 'course_plan_id' })
  @IsOptional()
  @IsMongoId()
  coursePlanId?: string;

  @ApiPropertyOptional({ example: 100000 })
  @IsOptional()
  @IsNumber()
  customDiscount?: number;
}

class CreateWithPlanDto extends CreateStudentsContractDto {
  @ApiPropertyOptional({ example: 'course_plan_id' })
  @IsOptional()
  @IsMongoId()
  coursePlanId?: string;
}

@ApiTags('students-contracts')
@Controller('students-contracts')
export class StudentsContractsController {
  constructor(private readonly studentsContractsService: StudentsContractsService) {}

  @ApiOperation({ summary: 'Create student contract with CoursePlan pricing (#33)' })
  @ApiResponse({ status: 201, description: 'Created successfully' })
  @Roles('SUPERADMIN', 'ADMIN', 'STAFF')
  @Post('with-plan')
  createWithPlan(@Body() dto: CreateWithPlanDto) {
    return this.studentsContractsService.createWithPlan(dto);
  }

  @ApiOperation({ summary: 'Create student contract' })
  @ApiResponse({ status: 201, description: 'Created successfully' })
  @Roles('SUPERADMIN', 'ADMIN', 'STAFF')
  @Post()
  create(@Body() createStudentsContractDto: CreateStudentsContractDto) {
    return this.studentsContractsService.create(createStudentsContractDto);
  }

  @ApiOperation({ summary: 'Get all student contracts' })
  @ApiResponse({ status: 200, description: 'All records' })
  @Get()
  findAll(
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    return this.studentsContractsService.findAll(limit, page);
  }

  @ApiOperation({ summary: 'Get student contract by ID' })
  @ApiResponse({ status: 200, description: 'Found' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentsContractsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update student contract' })
  @ApiResponse({ status: 200, description: 'Updated successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Roles('SUPERADMIN', 'ADMIN', 'STAFF')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentsContractDto: UpdateStudentsContractDto) {
    return this.studentsContractsService.update(id, updateStudentsContractDto);
  }

  @ApiOperation({
    summary: 'Change payment plan (#34) — cancels pending installments, creates new ones',
    description: 'Optionally provide coursePlanId for auto-pricing from CoursePlan (#33)',
  })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Roles('SUPERADMIN', 'ADMIN', 'STAFF')
  @Patch(':id/change-plan')
  changePlan(@Param('id') id: string, @Body() dto: ChangePlanDto) {
    return this.studentsContractsService.changePlan(
      id,
      dto.newPlan,
      dto.coursePlanId,
      dto.customDiscount,
    );
  }

  @ApiOperation({ summary: 'Delete student contract' })
  @ApiResponse({ status: 200, description: 'Deleted successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Roles('SUPERADMIN', 'ADMIN', 'STAFF')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentsContractsService.remove(id);
  }
}
