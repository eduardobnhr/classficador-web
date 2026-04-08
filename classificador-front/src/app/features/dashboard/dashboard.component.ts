import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';

import { Incident, IncidentService } from '../../core/services/incident.service';

interface MetricCard {
  title: string;
  value: string;
  meta: string;
  tone: 'primary' | 'error' | 'muted';
  icon?: string;
}

interface ThreatDistribution {
  label: string;
  value: number;
  tone: 'error' | 'primary' | 'tertiary';
}

interface Ticket {
  id: string;
  subject: string;
  category: 'SERVER' | 'NETWORK' | 'AUTH' | 'DB' | 'OPS';
  status: 'OPEN' | 'IN PROGRESS' | 'CLASSIFIED';
  createdAt: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ChartModule, ProgressBarModule, RouterLink, TableModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private readonly incidentService = inject(IncidentService);

  protected metrics: MetricCard[] = [
    { title: 'TOTAL DE INCIDENTES', value: '0', meta: 'Sem dados', tone: 'muted' },
    { title: 'CRÍTICOS', value: '0', meta: 'Sem dados', tone: 'muted' },
    { title: 'PENDENTES', value: '0', meta: 'Sem dados', tone: 'muted' },
    { title: 'CLASSIFICADOS', value: '0', meta: 'Sem dados', tone: 'muted' }
  ];

  protected readonly chartData = {
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
      }
    }
  };

  protected threats: ThreatDistribution[] = [];
  protected tickets: Ticket[] = [];

  ngOnInit(): void {
    this.incidentService.getDashboardStats().subscribe({
      next: (stats) => {
        this.metrics = [
          {
            title: 'TOTAL DE INCIDENTES',
            value: String(stats.totalIncidents),
            meta: stats.totalIncidents > 0 ? `${stats.totalIncidents} registrados` : 'Sem dados',
            tone: stats.totalIncidents > 0 ? 'primary' : 'muted'
          },
          {
            title: 'CRÍTICOS',
            value: String(stats.critical),
            meta: stats.critical > 0 ? 'High Risk' : 'Sem críticos',
            tone: stats.critical > 0 ? 'error' : 'muted'
          },
          {
            title: 'PENDENTES',
            value: String(stats.pending),
            meta: stats.pending > 0 ? 'Awaiting action' : 'Sem pendências',
            tone: 'muted'
          },
          {
            title: 'CLASSIFICADOS',
            value: String(stats.classified),
            meta: stats.totalIncidents > 0 ? `${Math.round((stats.classified / stats.totalIncidents) * 100)}% Resolved` : 'Sem dados',
            tone: stats.classified > 0 ? 'primary' : 'muted'
          }
        ];
        this.threats = stats.threatDistribution.map((item, index) => ({
          label: item.label,
          value: item.value,
          tone: index === 0 ? 'error' : index === 1 ? 'primary' : 'tertiary'
        }));
        this.tickets = stats.recentTickets.map((incident) => this.mapTicket(incident));
      },
      error: () => {
        this.threats = [];
        this.tickets = [];
      }
    });
  }

  private mapTicket(incident: Incident): Ticket {
    return {
      id: incident.id,
      subject: incident.title,
      category: this.mapCategory(incident.category),
      status: this.mapStatus(incident.status),
      createdAt: new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).format(new Date(incident.createdAt))
    };
  }

  private mapCategory(category: Incident['category']): Ticket['category'] {
    if (category === 'DB' || category === 'DATA_LEAK') {
      return 'DB';
    }

    if (category === 'AUTH' || category === 'SEGURANÇA') {
      return 'AUTH';
    }

    if (category === 'SERVER' || category === 'RECURSOS') {
      return 'SERVER';
    }

    if (category === 'OPS') {
      return 'OPS';
    }

    return 'NETWORK';
  }

  private mapStatus(status: Incident['status']): Ticket['status'] {
    if (status === 'CLASSIFICADO' || status === 'RESOLVIDO') {
      return 'CLASSIFIED';
    }

    if (status === 'EM_ANALISE') {
      return 'IN PROGRESS';
    }

    return 'OPEN';
  }
}
