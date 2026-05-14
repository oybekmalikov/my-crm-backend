import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@ApiTags('groups')
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @ApiOperation({ summary: 'Create a group', description: 'Add a new group' })
  @ApiResponse({ status: 201, description: 'Group created successfully' })
  @Post()
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.create(createGroupDto);
  }

  @ApiOperation({ summary: 'Get all groups', description: 'Retrieve a list of groups' })
  @ApiResponse({ status: 200, description: 'All groups' })
  @Get()
  findAll(
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    return this.groupsService.findAll(limit, page);
  }

  @ApiOperation({ summary: 'Get group by ID' })
  @ApiResponse({ status: 200, description: 'Group found' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update group' })
  @ApiResponse({ status: 200, description: 'Group updated successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupsService.update(id, updateGroupDto);
  }

  @ApiOperation({ summary: 'Delete group' })
  @ApiResponse({ status: 200, description: 'Group deleted successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupsService.remove(id);
  }
}
