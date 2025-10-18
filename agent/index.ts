import { LogEntry } from './types';
import { deepDelete, sleep } from '../utils/general'; // You will probably want to use these


export class LogTriageAgent {
  private logsFileNumber: number;
  private logs: LogEntry[];

  constructor(logsFileNumber: number, logs: LogEntry[]) {
    this.logsFileNumber = logsFileNumber;
    this.logs = logs;
  }

  async run(): Promise<string> {

    return "Implement your agent loop here. Make sure to have a breaking condition so it doesn't go on forever and burn your tokens.";
  }
}
