import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Incident } from 'src/models/entities/incident.entity';
import { Repository } from 'typeorm';

export interface DashboardThreatDistributionItem {
  label: string;
  value: number;
  category: string;
}

export interface DashboardTelemetryItem {
  label: string;
  value: number;
}

export interface DashboardStatsResponse {
  totalIncidents: number;
  critical: number;
  pending: number;
  classified: number;
  threatDistribution: DashboardThreatDistributionItem[];
  recentTickets: Incident[];
  telemetry: DashboardTelemetryItem[];
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Incident, 'pg')
    private readonly incidentRepository: Repository<Incident>,
  ) {}

  async getStats(userId: string, days = 7): Promise<DashboardStatsResponse> {
    const normalizedDays = this.normalizeDays(days);
    const incidents = await this.incidentRepository.find({
      where: { user_id: userId },
      relations: ['classification'],
      order: { created_at: 'DESC' },
    });

    return {
      totalIncidents: incidents.length,
      critical: incidents.filter((incident) => this.mapSeverity(incident.classification?.severity) === 'CRITICA').length,
      pending: incidents.filter((incident) => ['pending', 'classifying'].includes(incident.status.toLowerCase())).length,
      classified: incidents.filter((incident) => incident.status.toLowerCase() === 'classified').length,
      threatDistribution: this.buildThreatDistribution(incidents),
      recentTickets: incidents.slice(0, 5),
      telemetry: this.buildTelemetry(incidents, normalizedDays),
    };
  }

  private normalizeDays(days: number): number {
    return days === 30 ? 30 : 7;
  }

  private buildThreatDistribution(incidents: Incident[]): DashboardThreatDistributionItem[] {
    const classifiedIncidents = incidents.filter((incident) => incident.classification);
    const total = classifiedIncidents.length || 1;

    const counters = {
      REDE: 0,
      AUTH: 0,
      DATA_LEAK: 0,
    };

    for (const incident of classifiedIncidents) {
      const category = this.mapCategory(incident.classification?.category);

      if (category === 'REDE') {
        counters.REDE += 1;
      } else if (category === 'DATA_LEAK') {
        counters.DATA_LEAK += 1;
      } else {
        counters.AUTH += 1;
      }
    }

    return [
      {
        label: 'NETWORK BREACH',
        value: Math.round((counters.REDE / total) * 100),
        category: 'REDE',
      },
      {
        label: 'UNAUTHORIZED ACCESS',
        value: Math.round((counters.AUTH / total) * 100),
        category: 'AUTH',
      },
      {
        label: 'DATA LEAKAGE',
        value: Math.round((counters.DATA_LEAK / total) * 100),
        category: 'DATA_LEAK',
      },
    ];
  }

  private buildTelemetry(incidents: Incident[], days: number): DashboardTelemetryItem[] {
    const formatter =
      days === 30
        ? new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', timeZone: 'UTC' })
        : new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'UTC' });

    const today = new Date();
    const buckets = new Map<string, number>();

    for (let index = days - 1; index >= 0; index -= 1) {
      const date = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
      date.setUTCDate(date.getUTCDate() - index);
      buckets.set(this.dateKey(date), 0);
    }

    for (const incident of incidents) {
      const createdAt = new Date(incident.created_at);
      const key = this.dateKey(createdAt);

      if (buckets.has(key)) {
        buckets.set(key, (buckets.get(key) ?? 0) + 1);
      }
    }

    return Array.from(buckets.entries()).map(([key, value]) => ({
      label: this.formatTelemetryLabel(key, formatter, days),
      value,
    }));
  }

  private formatTelemetryLabel(key: string, formatter: Intl.DateTimeFormat, days: number): string {
    const [year, month, day] = key.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    const label = formatter.format(date);

    return days === 30 ? label : label.toUpperCase();
  }

  private dateKey(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  private mapSeverity(severity?: string): string {
    const normalizedSeverity = severity?.toLowerCase();

    if (normalizedSeverity === 'critical' || normalizedSeverity === 'critica') {
      return 'CRITICA';
    }

    if (normalizedSeverity === 'high' || normalizedSeverity === 'alta') {
      return 'ALTA';
    }

    if (normalizedSeverity === 'low' || normalizedSeverity === 'baixa') {
      return 'BAIXA';
    }

    return 'MEDIA';
  }

  private mapCategory(category?: string): string {
    const normalizedCategory = category?.toLowerCase();

    if (normalizedCategory?.includes('network') || normalizedCategory?.includes('rede')) {
      return 'REDE';
    }

    if (normalizedCategory?.includes('leak')) {
      return 'DATA_LEAK';
    }

    return 'AUTH';
  }
}
