export interface LogEntry {
  time: string;
  service: string;
  level: 'ERROR' | 'WARN' | 'INFO';
  msg: string;
}

export interface RecentChanges {
  timestamp: string;
  type: string;
  description: string;
  filesAffected: string[];
}