import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SHARED_IMPORTS } from '../../../../shared/shared.imports';
import { Incident, IncidentStatus, Severity } from '../../../../core/models/incident.model';
import { IncidentsService } from '../../../../core/services/incidents.service';

@Component({
  selector: 'app-incidents-list',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './incidents-list.component.html',
})
export class IncidentsListComponent {
  private readonly incidentsService = inject(IncidentsService);

  readonly query = signal('');
  readonly status = signal<IncidentStatus | 'all'>('all');
  readonly severity = signal<Severity | 'all'>('all');

  readonly statusOptions = [
    { label: 'Todos os Status', value: 'all' },
    { label: 'Pendente', value: 'pending' },
    { label: 'Classificando', value: 'classifying' },
    { label: 'Classificado', value: 'classified' },
  ];

  readonly severityOptions = [
    { label: 'Todas as Severidades', value: 'all' },
    { label: 'Baixa', value: 'low' },
    { label: 'Media', value: 'medium' },
    { label: 'Alta', value: 'high' },
    { label: 'Critica', value: 'critical' },
  ];

  readonly incidents = computed(() => {
    const query = this.query().toLowerCase().trim();

    return this.incidentsService.incidents().filter((incident) => {
      const matchesQuery =
        !query ||
        incident.id.toLowerCase().includes(query) ||
        incident.title.toLowerCase().includes(query) ||
        (incident.affectedAsset ?? '').toLowerCase().includes(query);
      const matchesStatus = this.status() === 'all' || incident.status === this.status();
      const matchesSeverity =
        this.severity() === 'all' || incident.classification?.severity === this.severity();

      return matchesQuery && matchesStatus && matchesSeverity;
    });
  });

  setQuery(value: string): void {
    this.query.set(value);
  }

  severityLabel(incident: Incident): string {
    return incident.classification?.severity ?? 'baixa';
  }

  statusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' {
    return status === 'classified' ? 'success' : status === 'pending' ? 'warn' : 'info';
  }
}
