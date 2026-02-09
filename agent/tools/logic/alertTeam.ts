import chalk from 'chalk';
import { LogEntry } from '../../types';

export const alertTeam = async (_logs: LogEntry[], args: { message: string }) => {
    const { message } = args;
    console.log(chalk.red.bold(`\n🚨 CRITICAL ALERT SENT TO TEAM: ${message}\n`));
    return { success: true, message: "Alert sent to team channel." };
};
