import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SupportService } from './support.service';
import { CreateSupportDto } from './dto/create-support.dto';
import { UpdateSupportDto } from './dto/update-support.dto';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('Support')
@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new support message' })
  create(@Body() createSupportDto: CreateSupportDto) {
    return this.supportService.create(createSupportDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all support messages with pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'userId', required: false, type: String })
  findAll(
    @Query('limit') limit?: number,
    @Query('page') page?: number,
    @Query('userId') userId?: string,
  ) {
    return this.supportService.findAll(+(limit || 10), +(page || 1), userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single support message by ID' })
  findOne(@Param('id') id: string) {
    return this.supportService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a support message' })
  update(@Param('id') id: string, @Body() updateSupportDto: UpdateSupportDto) {
    return this.supportService.update(id, updateSupportDto);
  }

  @Patch(':id/view')
  @ApiOperation({ summary: 'Mark a support message as viewed' })
  markAsViewed(@Param('id') id: string) {
    return this.supportService.markAsViewed(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a support message' })
  remove(@Param('id') id: string) {
    return this.supportService.remove(id);
  }
}
