import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewChecked,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CliEngineService, TerminalLine } from '../../services/cli-engine.service';

@Component({
  selector: 'app-terminal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './terminal.component.html',
  styleUrl: './terminal.component.css',
})
export class TerminalComponent implements OnInit, AfterViewChecked {
  @ViewChild('terminalBody') terminalBody!: ElementRef<HTMLDivElement>;
  @ViewChild('inputField') inputField!: ElementRef<HTMLInputElement>;

  lines: TerminalLine[] = [];
  currentInput = '';
  historyIndex = -1;
  private commandHistory: string[] = [];
  private shouldScroll = false;

  constructor(private cli: CliEngineService) {}

  ngOnInit() {
    this.lines = [
      { type: 'info', text: 'BioCPP Angular CLI v1.0' },
      { type: 'info', text: 'A bioinformatics sequence analysis tool' },
      { type: 'divider', text: '' },
      { type: 'output', text: "Type 'help' for available commands or 'example' to run the demo." },
      { type: 'divider', text: '' },
    ];
  }

  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  async onSubmit() {
    const input = this.currentInput.trim();
    if (!input) return;

    this.lines.push({ type: 'input', text: `> ${input}`, timestamp: new Date() });
    this.commandHistory.push(input);
    this.historyIndex = -1;
    this.currentInput = '';

    const results = await this.cli.execute(input);

    if (results.length === 1 && results[0].text === '__CLEAR__') {
      this.lines = [];
    } else {
      this.lines.push(...results);
    }

    this.shouldScroll = true;
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.navigateHistory(1);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.navigateHistory(-1);
    } else if (event.key === 'Tab') {
      event.preventDefault();
      this.autoComplete();
    }
  }

  focusInput() {
    this.inputField?.nativeElement.focus();
  }

  private navigateHistory(direction: number) {
    if (this.commandHistory.length === 0) return;

    if (this.historyIndex === -1) {
      this.historyIndex = this.commandHistory.length - 1;
    } else {
      this.historyIndex = Math.max(
        0,
        Math.min(this.commandHistory.length - 1, this.historyIndex - direction),
      );
    }

    this.currentInput = this.commandHistory[this.historyIndex] ?? '';
  }

  private autoComplete() {
    const commands = [
      'help', 'seq', 'translate', 'complement', 'revcomp',
      'alphabet', 'codons', 'frames', 'aa', 'info', 'example', 'clear',
    ];
    const partial = this.currentInput.toLowerCase().trim();
    if (!partial) return;

    const matches = commands.filter((c) => c.startsWith(partial));
    if (matches.length === 1) {
      this.currentInput = matches[0] + ' ';
    } else if (matches.length > 1) {
      this.lines.push({ type: 'info', text: `Completions: ${matches.join(', ')}` });
      this.shouldScroll = true;
    }
  }

  private scrollToBottom() {
    const el = this.terminalBody?.nativeElement;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }

  getLineClass(line: TerminalLine): string {
    return `line-${line.type}`;
  }
}
