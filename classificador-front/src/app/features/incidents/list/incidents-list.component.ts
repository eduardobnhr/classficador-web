import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';

interface FilterOption {
  label: string;
  value: string;
}

interface IncidentListItem {
  id: string;
  title: string;
  node: string;
  category: 'Rede' | 'Vulnerabilidade' | 'Data Leak' | 'Recursos' | 'Segurança';
  severity: 'CRÍTICA' | 'ALTA' | 'MÉDIA' | 'BAIXA';
  date: string;
  status: 'ATIVO' | 'EM ANÁLISE' | 'RESOLVIDO';
}

@Component({
  selector: 'app-incidents-list',
  standalone: true,
  imports: [DropdownModule, FormsModule, InputTextModule, MenuModule, RouterLink, TableModule],
  templateUrl: './incidents-list.component.html',
  styleUrl: './incidents-list.component.scss'
})
export class IncidentsListComponent {
  protected searchTerm = '';
  protected selectedStatus = 'all';
  protected selectedSeverity = 'all';
  protected selectedCategory = 'all';

  protected readonly statusOptions: FilterOption[] = [
    { label: 'Todos os Status', value: 'all' },
    { label: 'Ativo', value: 'active' },
    { label: 'Em Análise', value: 'analysis' },
    { label: 'Resolvido', value: 'resolved' },
    { label: 'Classificado', value: 'classified' }
  ];

  protected readonly severityOptions: FilterOption[] = [
    { label: 'Todas as Severidades', value: 'all' },
    { label: 'Crítica', value: 'critical' },
    { label: 'Alta', value: 'high' },
    { label: 'Média', value: 'medium' },
    { label: 'Baixa', value: 'low' }
  ];

  protected readonly categoryOptions: FilterOption[] = [
    { label: 'Todas as Categorias', value: 'all' },
    { label: 'Rede', value: 'network' },
    { label: 'Vulnerabilidade', value: 'vulnerability' },
    { label: 'Data Leak', value: 'data-leak' },
    { label: 'Recursos', value: 'resources' },
    { label: 'Segurança', value: 'security' }
  ];

  protected readonly actionItems: MenuItem[] = [
    { label: 'Abrir Detalhes', icon: 'pi pi-eye' },
    { label: 'Classificar', icon: 'pi pi-tags' },
    { label: 'Atribuir Operador', icon: 'pi pi-user-plus' }
  ];

  protected readonly incidents: IncidentListItem[] = [
    {
      id: '#INC-2023',
      title: 'Anomalia de tráfego detectada no gateway primário',
      node: 'Node: BR-SAO-01',
      category: 'Rede',
      severity: 'CRÍTICA',
      date: '07 ABR 2026 · 12:42',
      status: 'ATIVO'
    },
    {
      id: '#INC-2022',
      title: 'Tentativa de acesso privilegiado bloqueada',
      node: 'Node: BR-MAO-03',
      category: 'Segurança',
      severity: 'ALTA',
      date: '07 ABR 2026 · 11:18',
      status: 'EM ANÁLISE'
    },
    {
      id: '#INC-2021',
      title: 'Assinatura de vazamento encontrada em bucket',
      node: 'Node: DATA-LAKE-02',
      category: 'Data Leak',
      severity: 'CRÍTICA',
      date: '07 ABR 2026 · 09:56',
      status: 'ATIVO'
    },
    {
      id: '#INC-2020',
      title: 'Pacote vulnerável identificado em serviço interno',
      node: 'Node: APP-CORE-07',
      category: 'Vulnerabilidade',
      severity: 'MÉDIA',
      date: '06 ABR 2026 · 22:10',
      status: 'RESOLVIDO'
    },
    {
      id: '#INC-2019',
      title: 'Uso anormal de CPU no cluster de classificação',
      node: 'Node: ML-WORKER-04',
      category: 'Recursos',
      severity: 'BAIXA',
      date: '06 ABR 2026 · 18:34',
      status: 'RESOLVIDO'
    },
    {
      id: '#INC-2018',
      title: 'Handshake TLS recusado por política de certificado',
      node: 'Node: EDGE-SSL-01',
      category: 'Segurança',
      severity: 'ALTA',
      date: '06 ABR 2026 · 16:02',
      status: 'EM ANÁLISE'
    }
  ];
}
