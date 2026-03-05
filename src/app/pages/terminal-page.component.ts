import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TerminalComponent } from '../components/terminal/terminal.component';

@Component({
  selector: 'app-terminal-page',
  standalone: true,
  imports: [CommonModule, TerminalComponent],
  template: `
    <div class="page">
      <div class="page-header">
        <h1 class="page-title">Sequence Analysis Terminal</h1>
        <p class="page-subtitle">
          Translate DNA/RNA sequences, compute complements, and explore the genetic code
        </p>
      </div>
      <div class="terminal-wrapper">
        <app-terminal />
      </div>
      <div class="quick-start">
        <div class="quick-card" (click)="copyCommand('example')">
          <div class="quick-icon">&#9654;</div>
          <div class="quick-label">Run Example</div>
          <div class="quick-desc">See the BioCPP demo</div>
        </div>
        <div class="quick-card" (click)="copyCommand('translate GATTACATATA')">
          <div class="quick-icon">&#8644;</div>
          <div class="quick-label">Translate</div>
          <div class="quick-desc">6-frame translation</div>
        </div>
        <div class="quick-card" (click)="copyCommand('complement GATTACA')">
          <div class="quick-icon">&#8652;</div>
          <div class="quick-label">Complement</div>
          <div class="quick-desc">DNA complement</div>
        </div>
        <div class="quick-card" (click)="copyCommand('codons')">
          <div class="quick-icon">&#9783;</div>
          <div class="quick-label">Codon Table</div>
          <div class="quick-desc">Standard genetic code</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page {
      max-width: 960px;
      margin: 0 auto;
      padding: 32px 24px;
    }
    .page-header {
      margin-bottom: 24px;
    }
    .page-title {
      font-size: 28px;
      font-weight: 700;
      color: #e6edf3;
      margin: 0 0 8px;
    }
    .page-subtitle {
      font-size: 15px;
      color: #8b949e;
      margin: 0;
      line-height: 1.5;
    }
    .terminal-wrapper {
      height: 520px;
      margin-bottom: 24px;
    }
    .quick-start {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }
    .quick-card {
      background: #161b22;
      border: 1px solid #21262d;
      border-radius: 10px;
      padding: 16px;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: center;
    }
    .quick-card:hover {
      border-color: #388bfd40;
      background: #1c2128;
      transform: translateY(-2px);
    }
    .quick-icon {
      font-size: 22px;
      margin-bottom: 8px;
      color: #58a6ff;
    }
    .quick-label {
      font-size: 14px;
      font-weight: 600;
      color: #e6edf3;
      margin-bottom: 4px;
    }
    .quick-desc {
      font-size: 12px;
      color: #8b949e;
    }
    @media (max-width: 640px) {
      .quick-start {
        grid-template-columns: repeat(2, 1fr);
      }
      .terminal-wrapper {
        height: 400px;
      }
    }
  `],
})
export class TerminalPageComponent {
  copyCommand(cmd: string) {
    navigator.clipboard.writeText(cmd).catch(() => {});
  }
}
