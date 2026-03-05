import { Routes } from '@angular/router';
import { TerminalPageComponent } from './pages/terminal-page.component';
import { DocsPageComponent } from './pages/docs-page.component';
import { CodonTablePageComponent } from './pages/codon-table-page.component';

export const routes: Routes = [
  { path: '', component: TerminalPageComponent },
  { path: 'docs', component: DocsPageComponent },
  { path: 'codon-table', component: CodonTablePageComponent },
  { path: '**', redirectTo: '' },
];
