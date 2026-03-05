import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="header">
      <div class="header-inner">
        <a routerLink="/" class="logo">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" class="logo-icon">
            <circle cx="14" cy="14" r="13" stroke="#3fb950" stroke-width="2" fill="none"/>
            <path d="M8 10 Q14 4 20 10 Q14 16 8 10Z" fill="#3fb950" opacity="0.6"/>
            <path d="M8 18 Q14 12 20 18 Q14 24 8 18Z" fill="#58a6ff" opacity="0.6"/>
          </svg>
          <span class="logo-text">BioCPP<span class="logo-accent">Angular</span></span>
        </a>
        <nav class="nav">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">Terminal</a>
          <a routerLink="/docs" routerLinkActive="active" class="nav-link">Documentation</a>
          <a routerLink="/codon-table" routerLinkActive="active" class="nav-link">Codon Table</a>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background: #0d1117;
      border-bottom: 1px solid #21262d;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .header-inner {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 24px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      color: #e6edf3;
    }
    .logo-text {
      font-size: 18px;
      font-weight: 700;
      letter-spacing: -0.3px;
    }
    .logo-accent {
      color: #58a6ff;
      font-weight: 500;
    }
    .nav {
      display: flex;
      gap: 8px;
    }
    .nav-link {
      color: #8b949e;
      text-decoration: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.15s ease;
    }
    .nav-link:hover {
      color: #e6edf3;
      background: rgba(255, 255, 255, 0.04);
    }
    .nav-link.active {
      color: #e6edf3;
      background: rgba(56, 139, 253, 0.15);
    }
    @media (max-width: 640px) {
      .nav-link {
        padding: 8px 10px;
        font-size: 13px;
      }
    }
  `],
})
export class HeaderComponent {}
