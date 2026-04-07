import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SHARED_IMPORTS } from '../../../../shared/shared.imports';
import { IncidentsService } from '../../../../core/services/incidents.service';

@Component({
  selector: 'app-incident-detail',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './incident-detail.component.html',
})
export class IncidentDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly incidentsService = inject(IncidentsService);

  readonly incident = computed(() => {
    const id = this.route.snapshot.paramMap.get('id') ?? 'INC-8842';
    return this.incidentsService.getIncident(id) ?? this.incidentsService.incidents()[0];
  });

  readonly actions = computed(
    () =>
      this.incident().classification?.recommendedActions ?? [
        'Preservar Evidencias',
        'Abrir War Room',
        'Acionar Time de Rede',
        'Monitorar Ativo',
      ],
  );

  severity(): 'success' | 'info' | 'warn' | 'danger' {
    const severity = this.incident().classification?.severity;
    return severity === 'critical' ? 'danger' : severity === 'high' ? 'warn' : 'info';
  }
}
