import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface SequenceHistoryEntry {
  id?: string;
  command: string;
  input_sequence: string;
  operation: string;
  result: string;
  created_at?: string;
  session_id: string;
}

@Injectable({ providedIn: 'root' })
export class SequenceHistoryService {
  private sessionId: string;

  constructor(private supabase: SupabaseService) {
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  async saveEntry(entry: Omit<SequenceHistoryEntry, 'session_id'>): Promise<void> {
    try {
      await this.supabase.getClient()
        .from('sequence_history')
        .insert({ ...entry, session_id: this.sessionId });
    } catch {
      // silently fail if DB is unavailable
    }
  }

  async getHistory(limit = 50): Promise<SequenceHistoryEntry[]> {
    try {
      const { data } = await this.supabase.getClient()
        .from('sequence_history')
        .select('*')
        .eq('session_id', this.sessionId)
        .order('created_at', { ascending: false })
        .limit(limit);
      return data ?? [];
    } catch {
      return [];
    }
  }

  async getRecentEntries(limit = 10): Promise<SequenceHistoryEntry[]> {
    try {
      const { data } = await this.supabase.getClient()
        .from('sequence_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      return data ?? [];
    } catch {
      return [];
    }
  }
}
