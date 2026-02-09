import { searchLogsByIdentifier } from './logic/searchLogs';
import { checkRecentChanges } from './logic/recentChanges';
import { alertTeam } from './logic/alertTeam';
import { createTicket } from './logic/createTicket';
import { LogEntry } from '../types';

type ToolFunction = (logs: LogEntry[], args: any) => Promise<unknown> | unknown;

export const toolFunctions: Record<string, ToolFunction> = {
    search_logs_by_identifier: searchLogsByIdentifier,
    check_recent_changes: checkRecentChanges,
    alert_team: alertTeam,
    create_ticket: createTicket,
};
