import { LogEntry } from '../../types';
import { loadRecentChanges } from '../../../services/logsAndChangesService';

/**
 * Retrieves recent system changes (deployments, config updates) from all log sets.
 * In a real system, this would query a deployment/change tracking database.
 */
export const checkRecentChanges = async (_logs: LogEntry[], _args: Record<string, never>) => {
    const allChanges: { source: string; changes: any[] }[] = [];

    for (let i = 1; i <= 5; i++) {
        const changes = await loadRecentChanges(i);
        if (changes.length > 0) {
            allChanges.push({ source: `log_set_${i}`, changes });
        }
    }

    if (allChanges.length === 0) {
        return "No recent changes found.";
    }

    return allChanges;
};
