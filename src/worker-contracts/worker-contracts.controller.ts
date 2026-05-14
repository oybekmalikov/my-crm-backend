import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WorkerContractsService } from './worker-contracts.service';
import { CreateWorkerContractDto } from './dto/create-worker-contract.dto';
import { UpdateWorkerContractDto } from './dto/update-worker-contract.dto';

@ApiTags('worker-contracts')
@Controller('worker-contracts')
export class WorkerContractsController {
  constructor(private readonly workerContractsService: WorkerContractsService) {}

  @ApiOperation({ summary: 'Create worker contract' })
  @ApiResponse({ status: 201, description: 'Created successfully' })
  @Post()
  create(@Body() createWorkerContractDto: CreateWorkerContractDto) {
    return this.workerContractsService.create(createWorkerContractDto);
  }

  @ApiOperation({ summary: 'Get all worker contracts' })
  @ApiResponse({ status: 200, description: 'All records' })
  @Get()
  findAll(
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    return this.workerContractsService.findAll(limit, page);
  }

  @ApiOperation({ summary: 'Get worker contract by ID' })
  @ApiResponse({ status: 200, description: 'Found' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workerContractsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update worker contract' })
  @ApiResponse({ status: 200, description: 'Updated successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkerContractDto: UpdateWorkerContractDto) {
    return this.workerContractsService.update(id, updateWorkerContractDto);
  }

  @ApiOperation({ summary: 'Delete worker contract' })
  @ApiResponse({ status: 200, description: 'Deleted successfully' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workerContractsService.remove(id);
  }
}
