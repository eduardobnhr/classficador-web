import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { EMPTY, expand, switchMap, timer } from 'rxjs';

import { Incident, IncidentService, RecommendedAction } from '../../../core/services/incident.service';

interface MetadataItem {
  label: string;
  value: string;
  mono?: boolean;
}

@Component({
  selector: 'app-incident-detail',
  standalone: true,
  imports: [ConfirmDialogModule, DecimalPipe, RouterLink],
  templateUrl: './incident-detail.component.html',
  styleUrl: './incident-detail.component.scss'
})
export class IncidentDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly incidentService = inject(IncidentService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);

  protected incident: Incident | null = null;
  protected isRefreshingClassification = false;
  protected confidence = 0;
  protected progressOffset = 100;
  protected recommendedActions: RecommendedAction[] = [];
  protected metadata: MetadataItem[] = [];
  protected deleting = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      return;
    }

    this.watchIncident(id);
  }

  protected deleteIncident(): void {
    if (!this.incident) {
      return;
    }

    const incidentId = this.incident.id;

    this.confirmationService.confirm({
      key: 'delete-incident-detail',
      header: 'Excluir incidente',
      message: `Deseja realmente excluir o incidente ${incidentId}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.deleting = true;

        this.incidentService.deleteIncident(incidentId).subscribe({
          next: () => {
            this.messageService.add({
              key: 'system',
              severity: 'success',
              summary: 'Incidente excluido',
              detail: `O incidente ${incidentId} foi excluido com sucesso.`
            });
            void this.router.navigate(['/incidents']);
          },
          error: () => {
            this.deleting = false;
            this.messageService.add({
              key: 'system',
              severity: 'error',
              summary: 'Falha ao excluir',
              detail: `Nao foi possivel excluir o incidente ${incidentId}.`
            });
          }
        });
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

  protected hasClassification(): boolean {
    return !!this.incident?.aiClassification;
  }

  private watchIncident(id: string): void {
    this.incidentService
      .getIncidentById(id)
      .pipe(
        expand((incident) => {
          const shouldPoll = !incident.aiClassification && incident.status === 'EM_ANALISE';

          this.isRefreshingClassification = shouldPoll;

          return shouldPoll
            ? timer(2000).pipe(switchMap(() => this.incidentService.getIncidentById(id)))
            : EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (incident) => {
          this.applyIncidentState(incident);

          if (incident.aiClassification || incident.status !== 'EM_ANALISE') {
            this.isRefreshingClassification = false;
          }
        }
      });
  }

  private applyIncidentState(incident: Incident): void {
    this.incident = incident;
    this.confidence = incident.aiClassification?.confidence ?? 0;
    this.progressOffset = 100 - this.confidence;
    this.recommendedActions = incident.recommendedActions ?? [];
    this.metadata = [
      { label: 'Modelo Utilizado', value: incident.aiClassification?.model ?? 'N/D', mono: true },
      { label: 'Tempo de Processamento', value: incident.aiClassification?.processingTime ?? 'N/D' },
      { label: 'Data da Deteccao', value: incident.aiClassification?.detectedAt ?? this.formatDate(incident.createdAt) }
    ];
  }
}
