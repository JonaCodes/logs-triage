import { z } from 'zod';
import { tool } from 'ai';

export const tools = {
    search_logs_by_identifier: tool({
        description: 'Searches for logs using a specific identifier (e.g., Request ID, User ID, Batch ID) across ALL logs.',
        inputSchema: z.object({
            identifier: z.string().describe('The identifier to search for (e.g., "req-123", "user-456").'),
        }),
    }),
    check_recent_changes: tool({
        description: 'Retrieves a list of recent system changes (deployments, config updates, migrations) that might have caused the issue.',
        inputSchema: z.object({}),
    }),
    alert_team: tool({
        description: 'Sends a critical alert to the team. Use this when you find a severe issue that requires immediate human attention.',
        inputSchema: z.object({
            message: z.string().describe('The alert message to send to the team.'),
        }),
    }),
    create_ticket: tool({
        description: 'Creates a ticket for a non-critical issue (e.g., bug, performance issue) that needs to be tracked.',
        inputSchema: z.object({
            title: z.string().describe('The title of the ticket.'),
            description: z.string().describe('The detailed description of the issue.'),
            priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).describe('The priority of the ticket.'),
        }),
    }),
};
