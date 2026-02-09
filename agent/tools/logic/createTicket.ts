import chalk from 'chalk';
import { LogEntry } from '../../types';

export const createTicket = async (
    _logs: LogEntry[],
    args: { title: string; description: string; priority: string }
) => {
    const { title, description, priority } = args;
    console.log(chalk.yellow.bold(`\n🎫 TICKET CREATED`));
    console.log(chalk.blue(`Title: ${title}`));
    console.log(chalk.blue(`Priority: ${priority}`));
    console.log(chalk.blue(`Description: ${description}\n`));

    return { success: true, ticketId: `TICKET-${Math.floor(Math.random() * 1000)}`, status: "Open" };
};
