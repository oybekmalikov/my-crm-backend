import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Patch('params/:id')
  updateEventParams(
    @Param('id') id: string,
    @Body("newStatus") newStatus?: string,
    @Body("newDate") newDate?: string,
    @Body("newTime") newTime?: string,
  ) {
    return this.eventsService.updateEventParams(
      +id,
      newStatus,
      newDate,
      newTime,
    );
  }
  @ApiOperation({
    summary: 'Add event',
    description: 'Add event',
  })
  @ApiResponse({ status: 201, description: 'Event added successfully' })
  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @ApiOperation({
    summary: 'Get all events',
    description: 'Get all events',
  })
  @ApiResponse({ status: 200, description: 'All events' })
  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @ApiOperation({
    summary: 'Get event',
    description: 'Get event',
  })
  @ApiResponse({ status: 200, description: 'Event' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(+id);
  }

  @ApiOperation({
    summary: 'Update event',
    description: 'Update event',
  })
  @ApiResponse({ status: 200, description: 'Event updated successfully' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(+id, updateEventDto);
  }

  @ApiOperation({
    summary: 'Delete event',
    description: 'Delete event',
  })
  @ApiResponse({ status: 200, description: 'Event deleted successfully' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(+id);
  }
}
