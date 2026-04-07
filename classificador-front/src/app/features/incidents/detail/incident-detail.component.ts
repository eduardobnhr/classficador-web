import { Component, OnInit, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Incident, IncidentService, RecommendedAction } from '../../../core/services/incident.service';

interface MetadataItem {
  label: string;
  value: string;
  mono?: boolean;
}

@Component({
  selector: 'app-incident-detail',
  standalone: true,
  imports: [DecimalPipe, RouterLink],
  templateUrl: './incident-detail.component.html',
  styleUrl: './incident-detail.component.scss'
})
export class IncidentDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly incidentService = inject(IncidentService);

  protected incident: Incident | null = null;
  protected confidence = 0;
  protected progressOffset = 100;
  protected recommendedActions: RecommendedAction[] = [];
  protected metadata: MetadataItem[] = [];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      return;
    }

    this.incidentService.getIncidentById(id).subscribe({
      next: (incident) => {
        this.incident = incident;
        this.confidence = incident.aiClassification?.confidence ?? 0;
        this.progressOffset = 100 - this.confidence;
        this.recommendedActions = incident.recommendedActions ?? [];
        this.metadata = [
          { label: 'Modelo Utilizado', value: incident.aiClassification?.model ?? 'SENTINEL-V4.2-PRO', mono: true },
          { label: 'Tempo de Processamento', value: incident.aiClassification?.processingTime ?? 'N/D' },
          { label: 'Data da Detecção', value: incident.aiClassification?.detectedAt ?? this.formatDate(incident.createdAt) }
        ];
      }
    });
  }

  protected formatDate(value: string): string {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(value));
  }
}
