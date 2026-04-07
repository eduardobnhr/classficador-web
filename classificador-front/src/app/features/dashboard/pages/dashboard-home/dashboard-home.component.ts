import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { IncidentsService } from '../../../../core/services/incidents.service';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [RouterLink, TagModule],
  templateUrl: './dashboard-home.component.html',
})
export class DashboardHomeComponent {
  private readonly incidentsService = inject(IncidentsService);

  readonly incidents = this.incidentsService.incidents;
  readonly classified = computed(() => this.incidents().filter((incident) => incident.status === 'classified'));
  readonly critical = computed(
    () => this.incidents().filter((incident) => incident.classification?.severity === 'critical').length,
  );
  readonly pending = computed(
    () => this.incidents().filter((incident) => incident.status === 'pending' || incident.status === 'classifying').length,
  );

  readonly bars = [42, 58, 48, 72, 88, 63, 98, 42, 32, 54, 77, 68];

  statusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' {
    return status === 'classified' ? 'success' : status === 'pending' ? 'warn' : 'info';
  }
}
