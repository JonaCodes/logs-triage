import chalk from 'chalk';

export interface AlertTeamParams {
  teams: string;
  message: string;
}

export const alertTeam = (
  _logsFileNumber: number,
  params: AlertTeamParams
) => {
  console.log("\n\n=====================================================================");
  console.log(`${chalk.red("Sending alert")} to ${params.teams}:\n${params.message}`);
  console.log("=====================================================================\n\n");
  return { alerted: true };
};
