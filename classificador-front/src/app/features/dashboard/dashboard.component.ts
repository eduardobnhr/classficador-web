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
    { title: 'TOTAL DE INCIDENTES', value: '1,284', meta: '+12%', tone: 'primary' },
    { title: 'CRÍTICOS', value: '42', meta: 'High Risk', tone: 'error' },
    { title: 'PENDENTES', value: '156', meta: 'Awaiting action', tone: 'muted', icon: '···' },
    { title: 'CLASSIFICADOS', value: '1,086', meta: '84% Resolved', tone: 'primary', icon: '✓' }
  ];

  protected readonly chartData = {
    labels: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
    datasets: [
      {
        data: [42, 57, 48, 76, 63, 91, 84],
        backgroundColor: [
          'rgb(123 208 255 / 0.35)',
          'rgb(123 208 255 / 0.5)',
          'rgb(123 208 255 / 0.42)',
          'rgb(123 208 255 / 0.7)',
          'rgb(123 208 255 / 0.55)',
          'rgb(123 208 255 / 0.9)',
          'rgb(123 208 255 / 0.78)'
        ],
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

  protected threats: ThreatDistribution[] = [
    { label: 'NETWORK BREACH', value: 32, tone: 'error' },
    { label: 'UNAUTHORIZED ACCESS', value: 48, tone: 'primary' },
    { label: 'DATA LEAKAGE', value: 20, tone: 'tertiary' }
  ];

  protected tickets: Ticket[] = [
    {
      id: '#INC-1048',
      subject: 'Suspicious lateral movement detected',
      category: 'NETWORK',
      status: 'IN PROGRESS',
      createdAt: 'APR 07, 2026'
    },
    {
      id: '#INC-1047',
      subject: 'Privileged login outside policy window',
      category: 'AUTH',
      status: 'OPEN',
      createdAt: 'APR 07, 2026'
    },
    {
      id: '#INC-1046',
      subject: 'Database exfiltration signature matched',
      category: 'DB',
      status: 'CLASSIFIED',
      createdAt: 'APR 06, 2026'
    },
    {
      id: '#INC-1045',
      subject: 'Server telemetry degraded in cluster 04',
      category: 'SERVER',
      status: 'OPEN',
      createdAt: 'APR 06, 2026'
    },
    {
      id: '#INC-1044',
      subject: 'Operations alert threshold exceeded',
      category: 'OPS',
      status: 'CLASSIFIED',
      createdAt: 'APR 05, 2026'
    }
  ];

  ngOnInit(): void {
    this.incidentService.getDashboardStats().subscribe({
      next: (stats) => {
        this.metrics = [
          { title: 'TOTAL DE INCIDENTES', value: String(stats.totalIncidents), meta: '+12%', tone: 'primary' },
          { title: 'CRÍTICOS', value: String(stats.critical), meta: 'High Risk', tone: 'error' },
          { title: 'PENDENTES', value: String(stats.pending), meta: 'Awaiting action', tone: 'muted', icon: '···' },
          { title: 'CLASSIFICADOS', value: String(stats.classified), meta: '84% Resolved', tone: 'primary', icon: '✓' }
        ];
        this.threats = stats.threatDistribution.map((item, index) => ({
          label: item.label,
          value: item.value,
          tone: index === 0 ? 'error' : index === 1 ? 'primary' : 'tertiary'
        }));
        this.tickets = stats.recentTickets.map((incident) => this.mapTicket(incident));
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
