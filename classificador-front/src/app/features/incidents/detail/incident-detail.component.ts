import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface RecommendedAction {
  title: string;
  icon: string;
}

interface MetadataItem {
  label: string;
  value: string;
  mono?: boolean;
}

@Component({
  selector: 'app-incident-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './incident-detail.component.html',
  styleUrl: './incident-detail.component.scss'
})
export class IncidentDetailComponent {
  protected readonly confidence = 98.5;
  protected readonly progressOffset = 100 - this.confidence;

  protected readonly recommendedActions: RecommendedAction[] = [
    { title: 'Bloquear IPs de Origem', icon: 'pi pi-ban' },
    { title: 'Reset de Credenciais', icon: 'pi pi-key' },
    { title: 'Análise Forense', icon: 'pi pi-file' },
    { title: 'Isolamento de Rede', icon: 'pi pi-share-alt' }
  ];

  protected readonly metadata: MetadataItem[] = [
    { label: 'Modelo Utilizado', value: 'SENTINEL-V4.2-PRO', mono: true },
    { label: 'Tempo de Processamento', value: '12ms' },
    { label: 'Data da Detecção', value: '24/05/2024 - 14:32' }
  ];
}
