import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/layout/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <app-header />
    <main class="main-content">
      <router-outlet />
    </main>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    .main-content {
      flex: 1;
    }
  `],
})
export class AppComponent {}
