import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

interface ApiResponse<T> {
  data: T;
}

interface BackendClassification {
  category: string;
  severity: string;
  confidence_score: number | string;
  recommended_actions?: string | null;
  model_version?: string | null;
  classified_at: string;
}

interface BackendIncident {
  id: string;
  title: string;
  description: string;
  affected_asset?: string | null;
  occurred_at?: string | null;
  status: string;
  created_at: string;
  classification?: BackendClassification | null;
}

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

export interface CreateIncidentPayload {
  title: string;
  description: string;
  asset: string;
  occurredAt: string;
  category?: IncidentCategory;
  severity?: IncidentSeverity;
}

@Injectable({
  providedIn: 'root'
})
export class IncidentService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly apiUrl = environment.apiUrl;

  getIncidents(filter: IncidentFilter = {}): Observable<PagedResult<Incident>> {
    return this.http.get<ApiResponse<BackendIncident[]>>(`${this.apiUrl}/incident`, { params: this.buildParams(filter) }).pipe(
      map((response) => response.data.map((incident) => this.mapBackendIncident(incident))),
      map((incidents) => this.applyClientPaging(incidents, filter))
    );
  }

  getIncidentById(id: string): Observable<Incident> {
    return this.http
      .get<ApiResponse<BackendIncident>>(`${this.apiUrl}/incident/${id}`)
      .pipe(map((response) => this.mapBackendIncident(response.data)));
  }

  createIncident(payload: CreateIncidentPayload): Observable<Incident> {
    const backendPayload = {
      title: payload.title,
      description: payload.description,
      affected_asset: payload.asset,
      occurred_at: payload.occurredAt
    };

    return this.authService.ensureCsrfToken().pipe(
      switchMap(() => this.http.post<ApiResponse<BackendIncident>>(`${this.apiUrl}/incident`, backendPayload)),
      map((response) => this.mapBackendIncident(response.data))
    );
  }

  getDashboardStats(): Observable<DashboardStats> {
    return this.getIncidents({ page: 0, size: 100 }).pipe(
      map(({ data }) => ({
        totalIncidents: data.length,
        critical: data.filter((incident) => incident.severity === 'CRITICA').length,
        pending: data.filter((incident) => incident.status === 'ATIVO' || incident.status === 'EM_ANALISE').length,
        classified: data.filter((incident) => incident.status === 'CLASSIFICADO').length,
        threatDistribution: this.calculateThreatDistribution(data),
        recentTickets: data.slice(0, 5)
      }))
    );
  }

  private buildParams(filter: IncidentFilter): HttpParams {
    return Object.entries(filter).reduce((params, [key, value]) => {
      if (value === undefined || value === null || value === '' || value === 'all') {
        return params;
      }

      return params.set(key, String(value));
    }, new HttpParams());
  }

  private mapBackendIncident(incident: BackendIncident): Incident {
    const classification = incident.classification ?? undefined;
    const confidence = Number(classification?.confidence_score ?? 0);
    const recommendedActions = this.parseRecommendedActions(classification?.recommended_actions);

    return {
      id: incident.id,
      title: incident.title,
      description: incident.description,
      asset: incident.affected_asset ?? 'Ativo não informado',
      occurredAt: incident.occurred_at ?? incident.created_at,
      category: this.mapCategory(classification?.category),
      severity: this.mapSeverity(classification?.severity),
      status: this.mapStatus(incident.status),
      createdAt: incident.created_at,
      aiClassification: classification
        ? {
            confidence: confidence <= 1 ? confidence * 100 : confidence,
            category: classification.category,
            severity: classification.severity,
            model: classification.model_version ?? 'N/D',
            processingTime: 'N/D',
            detectedAt: new Date(classification.classified_at).toLocaleString('pt-BR')
          }
        : undefined,
      recommendedActions: recommendedActions.length > 0 ? recommendedActions : undefined
    };
  }

  private applyClientPaging(incidents: Incident[], filter: IncidentFilter): PagedResult<Incident> {
    const filteredIncidents = incidents.filter((incident) => this.matchesFilter(incident, filter));
    const page = filter.page ?? 0;
    const size = filter.size ?? 10;
    const start = page * size;

    return {
      data: filteredIncidents.slice(start, start + size),
      total: filteredIncidents.length,
      page,
      size
    };
  }

  private calculateThreatDistribution(incidents: Incident[]): ThreatDistributionItem[] {
    const total = incidents.length || 1;
    const auth = incidents.filter((incident) => incident.category === 'AUTH' || incident.category === 'SEGURANÇA').length;
    const network = incidents.filter((incident) => incident.category === 'REDE').length;
    const dataLeak = incidents.filter((incident) => incident.category === 'DATA_LEAK').length;

    return [
      { label: 'NETWORK BREACH', value: Math.round((network / total) * 100), category: 'REDE' },
      { label: 'UNAUTHORIZED ACCESS', value: Math.round((auth / total) * 100), category: 'AUTH' },
      { label: 'DATA LEAKAGE', value: Math.round((dataLeak / total) * 100), category: 'DATA_LEAK' }
    ];
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

  private mapStatus(status: string): IncidentStatus {
    const normalizedStatus = status.toLowerCase();

    if (normalizedStatus === 'classified') {
      return 'CLASSIFICADO';
    }

    if (normalizedStatus === 'classifying' || normalizedStatus === 'pending') {
      return 'EM_ANALISE';
    }

    if (normalizedStatus === 'resolved') {
      return 'RESOLVIDO';
    }

    return 'ATIVO';
  }

  private mapSeverity(severity?: string): IncidentSeverity {
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

  private mapCategory(category?: string): IncidentCategory {
    const normalizedCategory = category?.toLowerCase();

    if (normalizedCategory?.includes('network') || normalizedCategory?.includes('rede')) {
      return 'REDE';
    }

    if (normalizedCategory?.includes('leak')) {
      return 'DATA_LEAK';
    }

    if (normalizedCategory?.includes('auth') || normalizedCategory?.includes('phishing')) {
      return 'AUTH';
    }

    if (normalizedCategory?.includes('server')) {
      return 'SERVER';
    }

    if (normalizedCategory?.includes('db') || normalizedCategory?.includes('database')) {
      return 'DB';
    }

    return 'SEGURANÇA';
  }

  private parseRecommendedActions(actions?: string | null): RecommendedAction[] {
    if (!actions) {
      return [];
    }

    try {
      return JSON.parse(actions) as RecommendedAction[];
    } catch {
      return [];
    }
  }
}
