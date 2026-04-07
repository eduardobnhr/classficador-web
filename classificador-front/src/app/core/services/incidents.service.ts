import { Injectable, signal } from '@angular/core';
import { Incident } from '../models/incident.model';

@Injectable({ providedIn: 'root' })
export class IncidentsService {
  private readonly incidentsState = signal<Incident[]>([
    {
      id: 'INC-8842',
      userId: 'usr-001',
      title: 'Suspicious Login Pattern via API Gateway',
      description:
        'Detectado trafego anomalo com assinaturas compativeis com campanhas de phishing direcionadas a credenciais administrativas.',
      affectedAsset: 'GW-US-EAST',
      occurredAt: '2026-04-06T14:32:00.000Z',
      status: 'classified',
      createdAt: '2026-04-06T14:30:00.000Z',
      updatedAt: '2026-04-06T14:32:00.000Z',
      classification: {
        id: 'CLS-8842',
        incidentId: 'INC-8842',
        category: 'phishing',
        severity: 'critical',
        confidenceScore: 98.5,
        explanation:
          'Multiplas tentativas de autenticacao foram correlacionadas com indicadores de phishing e origem incomum.',
        recommendedActions: [
          'Bloquear IPs de Origem',
          'Reset de Credenciais',
          'Analise Forense',
          'Isolamento de Rede',
        ],
        modelVersion: 'SENTINEL-V4.2-PRO',
        classifiedAt: '2026-04-06T14:32:00.000Z',
      },
    },
    {
      id: 'INC-8821',
      userId: 'usr-001',
      title: 'Tentativa de Brute Force SSH',
      description: 'Sequencia de tentativas contra o Node BR-SAO-01.',
      affectedAsset: 'BR-SAO-01',
      occurredAt: '2026-04-05T22:40:00.000Z',
      status: 'classifying',
      createdAt: '2026-04-05T22:38:00.000Z',
      updatedAt: '2026-04-05T22:40:00.000Z',
      classification: {
        id: 'CLS-8821',
        incidentId: 'INC-8821',
        category: 'brute_force',
        severity: 'critical',
        confidenceScore: 91.4,
        classifiedAt: '2026-04-05T22:40:00.000Z',
      },
    },
    {
      id: 'INC-8820',
      userId: 'usr-001',
      title: 'Vulnerabilidade Kernel Linux',
      description: 'Servidor PROD-DB-02 sinalizou pacote vulneravel.',
      affectedAsset: 'PROD-DB-02',
      occurredAt: '2026-04-05T11:05:00.000Z',
      status: 'pending',
      createdAt: '2026-04-05T11:01:00.000Z',
      updatedAt: '2026-04-05T11:05:00.000Z',
      classification: {
        id: 'CLS-8820',
        incidentId: 'INC-8820',
        category: 'unauthorized_access',
        severity: 'high',
        confidenceScore: 78.2,
        classifiedAt: '2026-04-05T11:05:00.000Z',
      },
    },
    {
      id: 'INC-8815',
      userId: 'usr-001',
      title: 'Exfiltracao de Dados Detectada',
      description: 'Gateway GW-US-EAST apresentou volume incomum de saida.',
      affectedAsset: 'GW-US-EAST',
      occurredAt: '2026-04-04T23:58:00.000Z',
      status: 'classified',
      createdAt: '2026-04-04T23:55:00.000Z',
      updatedAt: '2026-04-04T23:58:00.000Z',
      classification: {
        id: 'CLS-8815',
        incidentId: 'INC-8815',
        category: 'data_leak',
        severity: 'critical',
        confidenceScore: 96.8,
        classifiedAt: '2026-04-04T23:58:00.000Z',
      },
    },
    {
      id: 'INC-8812',
      userId: 'usr-001',
      title: 'Uso Anomalo de CPU',
      description: 'Worker K8S-NODE-04 operando acima do baseline.',
      affectedAsset: 'K8S-NODE-04',
      occurredAt: '2026-04-04T18:20:00.000Z',
      status: 'classifying',
      createdAt: '2026-04-04T18:16:00.000Z',
      updatedAt: '2026-04-04T18:20:00.000Z',
      classification: {
        id: 'CLS-8812',
        incidentId: 'INC-8812',
        category: 'malware',
        severity: 'medium',
        confidenceScore: 62.1,
        classifiedAt: '2026-04-04T18:20:00.000Z',
      },
    },
  ]);

  readonly incidents = this.incidentsState.asReadonly();

  createIncident(input: Pick<Incident, 'title' | 'description' | 'affectedAsset' | 'occurredAt'>): Incident {
    const incident: Incident = {
      id: `INC-${Math.floor(Math.random() * 7000 + 1000)}`,
      userId: 'usr-001',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...input,
    };

    this.incidentsState.update((items) => [incident, ...items]);
    return incident;
  }

  getIncident(id: string): Incident | undefined {
    return this.incidentsState().find((incident) => incident.id === id);
  }
}
