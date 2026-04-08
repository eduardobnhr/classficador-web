import { Controller, Get, HttpCode, HttpStatus, Query, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @HttpCode(HttpStatus.OK)
  @Get('stats')
  async getStats(@Request() req, @Query('days') days?: string) {
    const userId = req.user.id;
    const parsedDays = Number(days ?? 7);

    return this.dashboardService.getStats(userId, Number.isFinite(parsedDays) ? parsedDays : 7);
  }
}
