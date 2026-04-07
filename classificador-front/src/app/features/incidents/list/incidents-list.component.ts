import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';

import { Incident, IncidentService } from '../../../core/services/incident.service';

interface FilterOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-incidents-list',
  standalone: true,
  imports: [DropdownModule, FormsModule, InputTextModule, MenuModule, RouterLink, TableModule],
  templateUrl: './incidents-list.component.html',
  styleUrl: './incidents-list.component.scss'
})
export class IncidentsListComponent implements OnInit {
  private readonly incidentService = inject(IncidentService);

  protected searchTerm = '';
  protected selectedStatus = 'all';
  protected selectedSeverity = 'all';
  protected selectedCategory = 'all';
  protected incidents: Incident[] = [];

  protected readonly statusOptions: FilterOption[] = [
    { label: 'Todos os Status', value: 'all' },
    { label: 'Ativo', value: 'ATIVO' },
    { label: 'Em Análise', value: 'EM_ANALISE' },
    { label: 'Resolvido', value: 'RESOLVIDO' },
    { label: 'Classificado', value: 'CLASSIFICADO' }
  ];

  protected readonly severityOptions: FilterOption[] = [
    { label: 'Todas as Severidades', value: 'all' },
    { label: 'Crítica', value: 'CRITICA' },
    { label: 'Alta', value: 'ALTA' },
    { label: 'Média', value: 'MEDIA' },
    { label: 'Baixa', value: 'BAIXA' }
  ];

  protected readonly categoryOptions: FilterOption[] = [
    { label: 'Todas as Categorias', value: 'all' },
    { label: 'Rede', value: 'REDE' },
    { label: 'Vulnerabilidade', value: 'VULNERABILIDADE' },
    { label: 'Data Leak', value: 'DATA_LEAK' },
    { label: 'Recursos', value: 'RECURSOS' },
    { label: 'Segurança', value: 'SEGURANÇA' }
  ];

  protected readonly actionItems: MenuItem[] = [
    { label: 'Abrir Detalhes', icon: 'pi pi-eye' },
    { label: 'Classificar', icon: 'pi pi-tags' },
    { label: 'Atribuir Operador', icon: 'pi pi-user-plus' }
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

  protected displayCategory(incident: Incident): string {
    return incident.category.replace('_', ' ');
  }

  protected displaySeverity(incident: Incident): string {
    return incident.severity === 'CRITICA' ? 'CRÍTICA' : incident.severity;
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
