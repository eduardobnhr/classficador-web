import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Documentation } from 'src/commons/configs/swagger/documentation';
import { Incident } from 'src/models/entities/incident.entity';
import { CreateIncidentDto } from '../../../models/dtos/incident/create-incident.dto';
import { IncidentService } from './incident.service';

@ApiTags('incident')
@Controller('incident')
export class IncidentController {
  constructor(private readonly incidentService: IncidentService) { }

  @Documentation.create(CreateIncidentDto, Incident)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @Body() createIncidentDto: CreateIncidentDto,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.incidentService.create(createIncidentDto, userId);
  }

  @Documentation.list(Incident)
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(@Request() req) {
    const userId = req.user.id;
    return this.incidentService.findAll(userId);
  }

  @Documentation.findOne(Incident)
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string, @Request() req) {
    const userId = req.user.id;
    return this.incidentService.findOne(id, userId);
  }
}
