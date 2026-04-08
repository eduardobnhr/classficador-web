import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly navigationItems = [
    { label: 'Painel', icon: 'pi pi-th-large', route: '/dashboard', exact: true },
    { label: 'Incidentes', icon: 'pi pi-shield', route: '/incidents', exact: true },
    { label: 'Novo Incidente', icon: 'pi pi-bell', route: '/incidents/new', exact: true },
    { label: 'Configuracoes', icon: 'pi pi-cog', route: '/settings', exact: true }
  ];

  protected logout(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }
}
