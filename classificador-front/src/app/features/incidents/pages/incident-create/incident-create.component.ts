import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SHARED_IMPORTS } from '../../../../shared/shared.imports';
import { IncidentsService } from '../../../../core/services/incidents.service';

@Component({
  selector: 'app-incident-create',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './incident-create.component.html',
})
export class IncidentCreateComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly incidentsService = inject(IncidentsService);

  readonly assetOptions = [
    { label: 'Gateway GW-US-EAST', value: 'GW-US-EAST' },
    { label: 'Node BR-SAO-01', value: 'BR-SAO-01' },
    { label: 'Servidor PROD-DB-02', value: 'PROD-DB-02' },
    { label: 'Worker K8S-NODE-04', value: 'K8S-NODE-04' },
  ];

  readonly form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    affectedAsset: ['', Validators.required],
    occurredAt: [new Date(), Validators.required],
    description: ['', [Validators.required, Validators.minLength(12)]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const incident = this.incidentsService.createIncident({
      title: value.title,
      affectedAsset: value.affectedAsset,
      occurredAt: value.occurredAt.toISOString(),
      description: value.description,
    });

    this.router.navigate(['/incidents', incident.id]);
  }
}
