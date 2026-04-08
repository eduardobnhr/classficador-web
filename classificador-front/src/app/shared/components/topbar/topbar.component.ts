import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthService);

  protected pageTitle = this.getTitle(this.router.url);
  protected showSearch = this.shouldShowSearch(this.router.url);
  protected operatorName = this.authService.getCurrentUser()?.name ?? 'Operador';

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((event) => {
        this.pageTitle = this.getTitle(event.urlAfterRedirects);
        this.showSearch = this.shouldShowSearch(event.urlAfterRedirects);
      });

    this.authService.currentUser$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => {
        this.operatorName = user?.name ?? 'Operador';
      });
  }

  private getTitle(url: string): string {
    if (url.startsWith('/dashboard')) {
      return 'PAINEL';
    }

    if (url.startsWith('/incidents/new')) {
      return 'NOVO INCIDENTE';
    }

    if (url.startsWith('/incidents/') && url !== '/incidents') {
      return 'DETALHES DO INCIDENTE';
    }

    if (url.startsWith('/incidents')) {
      return 'INCIDENTES';
    }

    if (url.startsWith('/settings')) {
      return 'CONFIGURACOES';
    }

    return 'CLASSIFICADOR-WEB';
  }

  private shouldShowSearch(url: string): boolean {
    return url.startsWith('/dashboard') || url.startsWith('/incidents');
  }
}
