import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [AvatarModule, ButtonModule, RouterLink],
  templateUrl: './topbar.component.html',
})
export class TopbarComponent {}
