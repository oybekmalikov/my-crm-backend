import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SyllabusService } from './syllabus.service';
import { CreateSyllabusDto, UpdateSyllabusDto } from './dto/syllabus.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles-decorator';

@ApiTags('Syllabus')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('syllabus')
export class SyllabusController {
  constructor(private readonly syllabusService: SyllabusService) {}

  @Post()
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Create a new syllabus module' })
  create(@Body() createSyllabusDto: CreateSyllabusDto) {
    return this.syllabusService.create(createSyllabusDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all syllabus modules (can filter by courseId)' })
  findAll(@Query() query: any) {
    return this.syllabusService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one syllabus module' })
  findOne(@Param('id') id: string) {
    return this.syllabusService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Update a syllabus module' })
  update(@Param('id') id: string, @Body() updateSyllabusDto: UpdateSyllabusDto) {
    return this.syllabusService.update(id, updateSyllabusDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete a syllabus module' })
  remove(@Param('id') id: string) {
    return this.syllabusService.remove(id);
  }
}
