import { loadLogs } from '../../services/logsAndChangesService';

export interface SearchLogsByIdentifierParams {
  identifier_type: string;
  identifier_value: string;
}

export const searchLogsByIdentifier = async (
  logsFileNumber: number,
  params: SearchLogsByIdentifierParams
) => {
  const { identifier_type: identifierType, identifier_value: identifierValue } = params;
  const logs = await loadLogs(logsFileNumber);

  const matchingLogs = logs.filter(log => {
    return log[identifierType] === identifierValue
  });

  return {
    logs: matchingLogs,
    total_count: matchingLogs.length,
  };
};
