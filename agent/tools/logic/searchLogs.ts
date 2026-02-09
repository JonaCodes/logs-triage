import { LogEntry } from '../../types';
import { loadLogs } from '../../../services/logsAndChangesService';

/**
 * Searches for logs containing a specific identifier across ALL log sets.
 * In a real system, this would query a centralized logging service.
 */
export const searchLogsByIdentifier = async (_visibleLogs: LogEntry[], args: { identifier: string }) => {
    const { identifier } = args;
    console.log(`Searching for identifier: ${identifier}`);

    const allFindings: { file: string; log: LogEntry }[] = [];

    // Search through all 5 log sets
    for (let i = 1; i <= 5; i++) {
        const logs = await loadLogs(i);
        const matches = logs.filter(log =>
            JSON.stringify(log).includes(identifier)
        );
        matches.forEach(log => allFindings.push({ file: `log_set_${i}`, log }));
    }

    if (allFindings.length === 0) {
        return `No logs found containing identifier: ${identifier}`;
    }

    return allFindings;
};
