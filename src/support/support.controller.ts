import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CreateSupportDto } from './dto/create-support.dto';
import { UpdateSupportDto } from './dto/update-support.dto';
import { SupportService } from './support.service';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @ApiOperation({
    summary: 'Create support chat',
    description: 'Create support chat',
  })
  @ApiResponse({
    status: 200,
    description: 'The support has been successfully created.',
  })
  @Post()
  create(@Body() createSupportDto: CreateSupportDto) {
    return this.supportService.create(createSupportDto);
  }

  @ApiOperation({
    summary: 'Get all support chat',
    description: 'Get all support chat',
  })
  @ApiResponse({
    status: 200,
    description: 'All support chats.',
  })
  @Get()
  findAll() {
    return this.supportService.findAll();
  }

  @ApiOperation({
    summary: 'Get one support chat',
    description: 'Get one support chat',
  })
  @ApiResponse({
    status: 200,
    description: 'Selected support chat.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supportService.findOne(+id);
  }

  @ApiOperation({
    summary: 'Update support chat',
    description: 'Update support chat',
  })
  @ApiResponse({
    status: 200,
    description: 'The support has been successfully updated.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSupportDto: UpdateSupportDto) {
    return this.supportService.update(+id, updateSupportDto);
  }

  @ApiOperation({
    summary: 'Delete support chat',
    description: 'Delete support chat',
  })
  @ApiResponse({
    status: 200,
    description: 'The support has been successfully deleted.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.supportService.remove(+id);
  }
}
