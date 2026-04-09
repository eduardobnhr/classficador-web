import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';

import { IncidentService } from '../../../core/services/incident.service';

@Component({
  selector: 'app-incident-create',
  standalone: true,
  imports: [CalendarModule, InputTextModule, InputTextareaModule, ReactiveFormsModule],
  templateUrl: './incident-create.component.html',
  styleUrl: './incident-create.component.scss'
})
export class IncidentCreateComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly incidentService = inject(IncidentService);
  private readonly router = inject(Router);

  protected readonly incidentForm = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(8)]],
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
        occurredAt: payload.occurredAt?.toISOString() ?? new Date().toISOString()
      })
      .subscribe({
        next: (incident) => {
          void this.router.navigate(['/incidents', incident.id]);
        }
      });
  }
}
