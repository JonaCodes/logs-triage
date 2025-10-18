import { LogEntry } from './types';
import { deepDelete, sleep } from '../utils/general'; // You will probably want to use these
import chalk from 'chalk'; // This is just for fun, don't worry about it


export class LogTriageAgent {
  private logsFileNumber: number;
  private logs: LogEntry[];

  constructor(logsFileNumber: number, logs: LogEntry[]) {
    this.logsFileNumber = logsFileNumber;
    this.logs = logs;
  }

  async run(): Promise<string> {
    return chalk.green(`Implement your agent loop here.
Make sure to have a breaking condition so it doesn't go on forever and ${chalk.red("burn your tokens")}`); 
  }
}
