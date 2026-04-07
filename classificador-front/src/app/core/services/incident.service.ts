import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, delay, of } from 'rxjs';

import { environment } from '../../../environments/environment';

export type IncidentCategory =
  | 'REDE'
  | 'VULNERABILIDADE'
  | 'DATA_LEAK'
  | 'RECURSOS'
  | 'SEGURANÇA'
  | 'AUTH'
  | 'SERVER'
  | 'DB'
  | 'OPS';

export type IncidentSeverity = 'CRITICA' | 'ALTA' | 'MEDIA' | 'BAIXA';

export type IncidentStatus = 'ATIVO' | 'EM_ANALISE' | 'CLASSIFICADO' | 'RESOLVIDO';

export interface RecommendedAction {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  asset: string;
  occurredAt: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  status: IncidentStatus;
  createdAt: string;
  aiClassification?: {
    confidence: number;
    category: string;
    severity: string;
    model: string;
    processingTime: string;
    detectedAt: string;
  };
  recommendedActions?: RecommendedAction[];
}

export interface IncidentFilter {
  search?: string;
  status?: string;
  severity?: string;
  category?: string;
  page?: number;
  size?: number;
}

export interface PagedResult<T> {
  data: T[];
  total: number;
  page: number;
  size: number;
}

export interface ThreatDistributionItem {
  label: string;
  value: number;
  category: IncidentCategory;
}

export interface DashboardStats {
  totalIncidents: number;
  critical: number;
  pending: number;
  classified: number;
  threatDistribution: ThreatDistributionItem[];
  recentTickets: Incident[];
}

export type CreateIncidentPayload = Pick<
  Incident,
  'title' | 'description' | 'asset' | 'occurredAt' | 'category' | 'severity'
>;

@Injectable({
  providedIn: 'root'
})
export class IncidentService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  private readonly mockIncidents: Incident[] = [
    {
      id: 'INC-2024-8842',
      title: 'Suspicious Login Pattern via API Gateway',
      description:
        'Sequência anômala de autenticações detectada no gateway público com padrões compatíveis com phishing e tentativa de enumeração.',
      asset: 'BR-SAO-01 · API Gateway',
      occurredAt: '2024-05-24T14:32:00.000Z',
      category: 'AUTH',
      severity: 'CRITICA',
      status: 'CLASSIFICADO',
      createdAt: '2024-05-24T14:33:12.000Z',
      aiClassification: {
        confidence: 98.5,
        category: 'PHISHING',
        severity: 'CRITICA',
        model: 'SENTINEL-V4.2-PRO',
        processingTime: '12ms',
        detectedAt: '24/05/2024 - 14:32'
      },
      recommendedActions: [
        {
          id: 'block-origin-ips',
          title: 'Bloquear IPs de Origem',
          description: 'Bloqueie temporariamente os IPs associados ao padrão suspeito.',
          icon: 'pi pi-ban'
        },
        {
          id: 'reset-credentials',
          title: 'Reset de Credenciais',
          description: 'Reinicie credenciais de contas administrativas relacionadas.',
          icon: 'pi pi-key'
        },
        {
          id: 'forensic-analysis',
          title: 'Análise Forense',
          description: 'Colete evidências e preserve logs do gateway e do serviço de autenticação.',
          icon: 'pi pi-file'
        },
        {
          id: 'network-isolation',
          title: 'Isolamento de Rede',
          description: 'Isole segmentos afetados até a mitigação ser validada.',
          icon: 'pi pi-share-alt'
        }
      ]
    },
    {
      id: 'INC-2024-8841',
      title: 'Anomalia de tráfego detectada no gateway primário',
      description: 'Picos de tráfego não reconhecido foram identificados em portas não convencionais.',
      asset: 'BR-SAO-01',
      occurredAt: '2026-04-07T12:42:00.000Z',
      category: 'REDE',
      severity: 'CRITICA',
      status: 'ATIVO',
      createdAt: '2026-04-07T12:45:00.000Z'
    },
    {
      id: 'INC-2024-8840',
      title: 'Pacote vulnerável identificado em serviço interno',
      description: 'Dependência com CVE crítica encontrada no serviço de classificação.',
      asset: 'APP-CORE-07',
      occurredAt: '2026-04-06T22:10:00.000Z',
      category: 'VULNERABILIDADE',
      severity: 'MEDIA',
      status: 'RESOLVIDO',
      createdAt: '2026-04-06T22:16:00.000Z'
    },
    {
      id: 'INC-2024-8839',
      title: 'Assinatura de vazamento encontrada em bucket',
      description: 'Possível exposição de dados foi identificada por correspondência de assinatura.',
      asset: 'DATA-LAKE-02',
      occurredAt: '2026-04-07T09:56:00.000Z',
      category: 'DATA_LEAK',
      severity: 'ALTA',
      status: 'EM_ANALISE',
      createdAt: '2026-04-07T10:02:00.000Z'
    },
    {
      id: 'INC-2024-8838',
      title: 'Uso anormal de CPU no cluster de classificação',
      description: 'Worker de classificação excedeu o baseline operacional por janela prolongada.',
      asset: 'ML-WORKER-04',
      occurredAt: '2026-04-06T18:34:00.000Z',
      category: 'RECURSOS',
      severity: 'BAIXA',
      status: 'RESOLVIDO',
      createdAt: '2026-04-06T18:41:00.000Z'
    }
  ];

  getIncidents(filter: IncidentFilter = {}): Observable<PagedResult<Incident>> {
    const params = this.buildParams(filter);

    return this.http
      .get<PagedResult<Incident>>(`${this.apiUrl}/incidents`, { params })
      .pipe(catchError(() => this.getMockIncidents(filter)));
  }

  getIncidentById(id: string): Observable<Incident> {
    return this.http
      .get<Incident>(`${this.apiUrl}/incidents/${id}`)
      .pipe(catchError(() => this.getMockIncidentById(id)));
  }

  createIncident(payload: CreateIncidentPayload): Observable<Incident> {
    return this.http
      .post<Incident>(`${this.apiUrl}/incidents`, payload)
      .pipe(catchError(() => this.createMockIncident(payload)));
  }

  getDashboardStats(): Observable<DashboardStats> {
    return this.http
      .get<DashboardStats>(`${this.apiUrl}/dashboard/stats`)
      .pipe(catchError(() => this.getMockDashboardStats()));
  }

  private buildParams(filter: IncidentFilter): HttpParams {
    return Object.entries(filter).reduce((params, [key, value]) => {
      if (value === undefined || value === null || value === '') {
        return params;
      }

      return params.set(key, String(value));
    }, new HttpParams());
  }

  private getMockIncidents(filter: IncidentFilter): Observable<PagedResult<Incident>> {
    const page = filter.page ?? 0;
    const size = filter.size ?? 10;
    const filteredIncidents = this.mockIncidents.filter((incident) => this.matchesFilter(incident, filter));
    const start = page * size;
    const data = filteredIncidents.slice(start, start + size);

    return of({
      data,
      total: filteredIncidents.length,
      page,
      size
    }).pipe(delay(300));
  }

  private getMockIncidentById(id: string): Observable<Incident> {
    const normalizedId = id.startsWith('INC-') ? id : `INC-2024-${id}`;
    const incident = this.mockIncidents.find((item) => item.id === normalizedId) ?? this.mockIncidents[0];

    return of(incident).pipe(delay(300));
  }

  private createMockIncident(payload: CreateIncidentPayload): Observable<Incident> {
    const incident: Incident = {
      ...payload,
      id: `INC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'EM_ANALISE',
      createdAt: new Date().toISOString()
    };

    this.mockIncidents.unshift(incident);

    return of(incident).pipe(delay(300));
  }

  private getMockDashboardStats(): Observable<DashboardStats> {
    return of({
      totalIncidents: 1284,
      critical: 42,
      pending: 156,
      classified: 1086,
      threatDistribution: [
        { label: 'NETWORK BREACH', value: 32, category: 'REDE' },
        { label: 'UNAUTHORIZED ACCESS', value: 48, category: 'AUTH' },
        { label: 'DATA LEAKAGE', value: 20, category: 'DATA_LEAK' }
      ],
      recentTickets: this.mockIncidents.slice(0, 5)
    }).pipe(delay(300));
  }

  private matchesFilter(incident: Incident, filter: IncidentFilter): boolean {
    const search = filter.search?.toLowerCase().trim();

    if (search && !`${incident.id} ${incident.title}`.toLowerCase().includes(search)) {
      return false;
    }

    if (filter.status && filter.status !== 'all' && incident.status !== filter.status) {
      return false;
    }

    if (filter.severity && filter.severity !== 'all' && incident.severity !== filter.severity) {
      return false;
    }

    if (filter.category && filter.category !== 'all' && incident.category !== filter.category) {
      return false;
    }

    return true;
  }
}
