import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@ApiTags('branches')
@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @ApiOperation({ summary: 'Create a branch', description: 'Add a new branch' })
  @ApiResponse({ status: 201, description: 'Branch created successfully' })
  @Post()
  create(@Body() createBranchDto: CreateBranchDto) {
    return this.branchesService.create(createBranchDto);
  }

  @ApiOperation({ summary: 'Get all branches', description: 'Retrieve a list of branches' })
  @ApiResponse({ status: 200, description: 'All branches' })
  @Get()
  findAll(
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    return this.branchesService.findAll(limit, page);
  }

  @ApiOperation({ summary: 'Get branch by ID' })
  @ApiResponse({ status: 200, description: 'Branch found' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.branchesService.findOne(id);
  }

  @ApiOperation({ summary: 'Update branch' })
  @ApiResponse({ status: 200, description: 'Branch updated successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBranchDto: UpdateBranchDto) {
    return this.branchesService.update(id, updateBranchDto);
  }

  @ApiOperation({ summary: 'Delete branch' })
  @ApiResponse({ status: 200, description: 'Branch deleted successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.branchesService.remove(id);
  }
}
