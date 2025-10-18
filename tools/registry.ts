import { LogEntry, RecentChanges } from '../agent/types';
import { searchLogsByIdentifier } from './logic/search-logs-by-identifier';
import { getRecentChanges } from './logic/get-recent-changes';
import { createTicket } from './logic/create-ticket';
import { alertTeam } from './logic/alert-team';

type ToolFunction = (logsFileNumber:number, args: any) => Promise<unknown> | unknown;

export const toolFunctions: Record<string, ToolFunction> = {
  search_logs_by_identifier: searchLogsByIdentifier,
  get_recent_changes: getRecentChanges,
  create_ticket: createTicket,
  alert_team: alertTeam,
};
