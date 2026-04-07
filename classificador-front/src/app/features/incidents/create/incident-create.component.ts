import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';

import { IncidentService } from '../../../core/services/incident.service';

interface AssetOption {
  label: string;
  value: string;
  icon: string;
}

@Component({
  selector: 'app-incident-create',
  standalone: true,
  imports: [CalendarModule, DropdownModule, InputTextModule, InputTextareaModule, ReactiveFormsModule],
  templateUrl: './incident-create.component.html',
  styleUrl: './incident-create.component.scss'
})
export class IncidentCreateComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly incidentService = inject(IncidentService);
  private readonly router = inject(Router);

  protected readonly affectedAssets: AssetOption[] = [
    { label: 'BR-SAO-01 · API Gateway', value: 'br-sao-01', icon: 'pi pi-server' },
    { label: 'BR-MAO-03 · Auth Service', value: 'br-mao-03', icon: 'pi pi-server' },
    { label: 'DATA-LAKE-02 · Storage Node', value: 'data-lake-02', icon: 'pi pi-database' },
    { label: 'ML-WORKER-04 · Classifier Node', value: 'ml-worker-04', icon: 'pi pi-microchip' }
  ];

  protected readonly incidentForm = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(8)]],
    affectedAsset: ['', [Validators.required]],
    occurredAt: [null as Date | null, [Validators.required]],
    description: ['', [Validators.required, Validators.minLength(24)]]
  });

  protected submitForClassification(): void {
    if (this.incidentForm.invalid) {
      this.incidentForm.markAllAsTouched();
      return;
    }

    const payload = this.incidentForm.getRawValue();

    this.incidentService
      .createIncident({
        title: payload.title,
        description: payload.description,
        asset: payload.affectedAsset,
        occurredAt: payload.occurredAt?.toISOString() ?? new Date().toISOString()
      })
      .subscribe({
        next: (incident) => {
          void this.router.navigate(['/incidents', incident.id]);
        }
      });
  }
}
