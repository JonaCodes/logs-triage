import { LogEntry, RecentChanges } from '../../agent/types';
import { loadRecentChanges } from '../../services/logsAndChangesService';

export const getRecentChanges = async (
  logFileNumber: number,
) => {
  const recentChanges = await loadRecentChanges(logFileNumber);
  return recentChanges
};
