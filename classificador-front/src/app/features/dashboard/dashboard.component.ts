import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';

import { Incident, IncidentService } from '../../core/services/incident.service';

interface MetricCard {
  title: string;
  value: string;
  meta: string;
  tone: 'primary' | 'error' | 'muted';
}

interface Ticket {
  id: string;
  subject: string;
  category: string;
  status: 'ABERTO' | 'EM ANALISE' | 'CLASSIFICADO';
  createdAt: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ChartModule, RouterLink, TableModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private readonly incidentService = inject(IncidentService);

  protected readonly telemetryWindowOptions = [7, 30] as const;
  protected selectedTelemetryWindow = 7;
  protected metrics: MetricCard[] = [
    { title: 'TOTAL DE INCIDENTES', value: '0', meta: 'Sem dados', tone: 'muted' },
    { title: 'CRITICOS', value: '0', meta: 'Sem dados', tone: 'muted' },
    { title: 'PENDENTES', value: '0', meta: 'Sem dados', tone: 'muted' },
    { title: 'CLASSIFICADOS', value: '0', meta: 'Sem dados', tone: 'muted' }
  ];

  protected chartData = {
    labels: [] as string[],
    datasets: [
      {
        data: [] as number[],
        backgroundColor: [] as string[],
        borderRadius: 6,
        borderSkipped: false,
        barThickness: 22
      }
    ]
  };

  protected readonly chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#222a3d',
        titleColor: '#e2e5f0',
        bodyColor: '#c1c6d7',
        displayColors: false
      }
    },
    scales: {
      x: {
        border: {
          display: false
        },
        grid: {
          color: 'rgb(193 198 215 / 0.05)',
          drawTicks: false
        },
        ticks: {
          color: '#c1c6d7',
          font: {
            family: 'Inter',
            size: 11
          }
        }
      },
      y: {
        beginAtZero: true,
        border: {
          display: false
        },
        grid: {
          color: 'rgb(193 198 215 / 0.05)',
          drawTicks: false
        },
        ticks: {
          precision: 0,
          color: '#c1c6d7',
          font: {
            family: 'Inter',
            size: 11
          }
        }
      }
    }
  };

  protected tickets: Ticket[] = [];

  ngOnInit(): void {
    this.loadDashboardStats(this.selectedTelemetryWindow);
  }

  protected selectTelemetryWindow(days: 7 | 30): void {
    if (days === this.selectedTelemetryWindow) {
      return;
    }

    this.selectedTelemetryWindow = days;
    this.loadDashboardStats(days);
  }

  private loadDashboardStats(days: number): void {
    this.incidentService.getDashboardStats(days).subscribe({
      next: (stats) => {
        this.metrics = [
          {
            title: 'TOTAL DE INCIDENTES',
            value: String(stats.totalIncidents),
            meta: stats.totalIncidents > 0 ? `${stats.totalIncidents} registrados` : 'Sem dados',
            tone: stats.totalIncidents > 0 ? 'primary' : 'muted'
          },
          {
            title: 'CRITICOS',
            value: String(stats.critical),
            meta: stats.critical > 0 ? 'Risco elevado' : 'Sem criticos',
            tone: stats.critical > 0 ? 'error' : 'muted'
          },
          {
            title: 'PENDENTES',
            value: String(stats.pending),
            meta: stats.pending > 0 ? 'Aguardando acao' : 'Sem pendencias',
            tone: 'muted'
          },
          {
            title: 'CLASSIFICADOS',
            value: String(stats.classified),
            meta: stats.totalIncidents > 0 ? `${Math.round((stats.classified / stats.totalIncidents) * 100)}% concluidos` : 'Sem dados',
            tone: stats.classified > 0 ? 'primary' : 'muted'
          }
        ];

        this.chartData = {
          ...this.chartData,
          labels: stats.telemetry.map((item) => item.label),
          datasets: [
            {
              ...this.chartData.datasets[0],
              data: stats.telemetry.map((item) => item.value),
              backgroundColor: stats.telemetry.map((_, index, items) => this.buildBarColor(index, items.length))
            }
          ]
        };

        this.tickets = stats.recentTickets.map((incident) => this.mapTicket(incident));
      },
      error: () => {
        this.tickets = [];
        this.chartData = {
          ...this.chartData,
          labels: [],
          datasets: [
            {
              ...this.chartData.datasets[0],
              data: [],
              backgroundColor: []
            }
          ]
        };
      }
    });
  }

  private buildBarColor(index: number, total: number): string {
    if (total <= 1) {
      return 'rgb(123 208 255 / 0.92)';
    }

    const opacity = 0.45 + (index / (total - 1)) * 0.45;
    return `rgb(123 208 255 / ${opacity.toFixed(2)})`;
  }

  private mapTicket(incident: Incident): Ticket {
    return {
      id: incident.id,
      subject: incident.title,
      category: incident.aiClassification?.category ?? incident.category,
      status: this.mapStatus(incident.status),
      createdAt: new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).format(new Date(incident.createdAt))
    };
  }

  private mapStatus(status: Incident['status']): Ticket['status'] {
    if (status === 'CLASSIFICADO' || status === 'RESOLVIDO') {
      return 'CLASSIFICADO';
    }

    if (status === 'EM_ANALISE') {
      return 'EM ANALISE';
    }

    return 'ABERTO';
  }
}
