import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

import { Incident, IncidentService } from '../../../core/services/incident.service';

interface FilterOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-incidents-list',
  standalone: true,
  imports: [ConfirmDialogModule, DropdownModule, FormsModule, InputTextModule, RouterLink, TableModule],
  templateUrl: './incidents-list.component.html',
  styleUrl: './incidents-list.component.scss'
})
export class IncidentsListComponent implements OnInit {
  private readonly incidentService = inject(IncidentService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);

  protected searchTerm = '';
  protected selectedStatus = 'all';
  protected selectedSeverity = 'all';
  protected selectedCategory = 'all';
  protected incidents: Incident[] = [];
  protected deletingIncidentId: string | null = null;

  protected readonly statusOptions: FilterOption[] = [
    { label: 'Todos os Status', value: 'all' },
    { label: 'Ativo', value: 'ATIVO' },
    { label: 'Em Analise', value: 'EM_ANALISE' },
    { label: 'Resolvido', value: 'RESOLVIDO' },
    { label: 'Classificado', value: 'CLASSIFICADO' }
  ];

  protected readonly severityOptions: FilterOption[] = [
    { label: 'Todas as Severidades', value: 'all' },
    { label: 'Critica', value: 'CRITICA' },
    { label: 'Alta', value: 'ALTA' },
    { label: 'Media', value: 'MEDIA' },
    { label: 'Baixa', value: 'BAIXA' }
  ];

  protected readonly categoryOptions: FilterOption[] = [
    { label: 'Todas as Categorias', value: 'all' },
    { label: 'Rede', value: 'REDE' },
    { label: 'Vulnerabilidade', value: 'VULNERABILIDADE' },
    { label: 'Data Leak', value: 'DATA_LEAK' },
    { label: 'Recursos', value: 'RECURSOS' },
    { label: 'Seguranca', value: 'SEGURANCA' }
  ];

  ngOnInit(): void {
    this.loadIncidents();
  }

  protected loadIncidents(): void {
    this.incidentService
      .getIncidents({
        search: this.searchTerm,
        status: this.selectedStatus,
        severity: this.selectedSeverity,
        category: this.selectedCategory,
        page: 0,
        size: 20
      })
      .subscribe({
        next: (result) => {
          this.incidents = result.data;
        }
      });
  }

  protected deleteIncident(incident: Incident): void {
    this.confirmationService.confirm({
      key: 'delete-incident-list',
      header: 'Excluir incidente',
      message: `Deseja realmente excluir o incidente ${incident.id}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.deletingIncidentId = incident.id;

        this.incidentService.deleteIncident(incident.id).subscribe({
          next: () => {
            this.incidents = this.incidents.filter((item) => item.id !== incident.id);
            this.deletingIncidentId = null;
            this.messageService.add({
              key: 'system',
              severity: 'success',
              summary: 'Incidente excluido',
              detail: `O incidente ${incident.id} foi excluido com sucesso.`
            });
          },
          error: () => {
            this.deletingIncidentId = null;
            this.messageService.add({
              key: 'system',
              severity: 'error',
              summary: 'Falha ao excluir',
              detail: `Nao foi possivel excluir o incidente ${incident.id}.`
            });
          }
        });
      }
    });
  }

  protected displayCategory(incident: Incident): string {
    return incident.category.replace('_', ' ');
  }

  protected displaySeverity(incident: Incident): string {
    return incident.severity === 'CRITICA' ? 'CRITICA' : incident.severity;
  }

  protected displayStatus(incident: Incident): string {
    return incident.status.replace('_', ' ');
  }

  protected formatDate(value: string): string {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(value));
  }
}
