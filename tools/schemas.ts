import { z } from 'zod';
import { tool } from 'ai';

export const tools = {
  search_logs_by_identifier: tool({
    description: `Search all logs using a specific identifier.
    If you call this tool with identifier A, and it returns data that includes identifier B, call this tool again with identifier B to trace the root cause.
    DO NOT call this tool with the same identifier type multiple times, instead try different identifier types to dig deep.`,
    inputSchema: z.object({
      identifier_type: z.enum(['batch_id', 'user_id', 'source_id', 'request_id']).describe('Any identifier found in the logs, e.g user_id, request_id, etc, or error_type for errors'),
      identifier_value: z.string().describe('The actual ID value to search for'),
    }),
  }),

  get_recent_changes: tool({
    description: 'Pull recent system changes (deployments, config changes, migrations) to correlate with errors.',
    inputSchema: z.object(),
  }),

  create_ticket: tool({
    description: 'Create a tracking ticket for non-urgent issues (warnings, minor bugs, tech debt).',
    inputSchema: z.object({
      title: z.string().describe('Brief, descriptive title'),
      description: z.string().describe('1 sentence description with findings'),
    }),
  }),

  alert_team: tool({
    description: 'Alert the team for clear issues (system outages, widespread errors, data loss). Do not send alert before completing your investigation.',
    inputSchema: z.object({
      teams: z.string().describe('The teams to alert, separated by commas if more than one. Each service (payment-service, auth service, etc) has its own team.'),
      message: z.string().describe(`A message in the following format:
        ALERT!
        What happened: <3-4 words>
        Proof: <relevant context in 1-2 lines>
        Next step: <1 sentence recommendation>`),
    }),
  }),
};