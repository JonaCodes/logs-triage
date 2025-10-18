import chalk from 'chalk';

export interface CreateTicketParams {
  title: string;
  description: string;
}

export interface CreateTicketResult {
  created_at: string;
}

export const createTicket = (
  _logsFileNumber: number,
  params: CreateTicketParams
): CreateTicketResult => {

  console.log("\n\n=====================================================================");
  console.log(`${chalk.yellow("Creating ticket")}: ${params.title}`);
  console.log(`Description: ${params.description}`);
  console.log("=====================================================================\n\n");

  return { created_at: new Date().toISOString() };
};
