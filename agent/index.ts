import { generateText, ModelMessage, TypedToolCall } from 'ai';
import { google } from '@ai-sdk/google';
import { LogEntry } from './types';
import { INITIAL_SYSTEM_PROMPT } from './prompt';
import { tools } from '../tools/schemas';
import { toolFunctions } from '../tools/registry';
import { deepDelete, sleep } from '../utils/general';
import chalk from 'chalk';

const MAX_STEPS = 5;

export class LogTriageAgent {
  private agentMemory: ModelMessage[];
  private logsFileNumber: number;
  private step: number;

  constructor(logsFileNumber: number, logs: LogEntry[]) {
    this.agentMemory = [
      {
        role: 'system',
        content: INITIAL_SYSTEM_PROMPT,
      },
      {
        role: 'user',
        content: JSON.stringify(logs, null, 2),
      },
    ];

    this.logsFileNumber = logsFileNumber;
    this.step = 0;
  }

  private addToMemory(toolCallId: string, toolName: string, result: unknown): void {
    this.agentMemory.push({
      role: 'tool',
      content: [
        {
          type: 'tool-result',
          toolCallId,
          toolName,
          output: { type: 'json', value: result as any },
        },
      ],
    });
  }

  private handleUnknownToolCall(toolCall: TypedToolCall<typeof tools>): void {
    this.addToMemory(
      toolCall.toolCallId,
      toolCall.toolName,
      { error: `Unknown tool: ${toolCall.toolName}` }
    );
  }

  private handleToolCallError(error: Error, toolCall: TypedToolCall<typeof tools>): void {
    this.addToMemory(
      toolCall.toolCallId,
      toolCall.toolName,
      { error: error instanceof Error ? error.message : 'Tool execution failed' }
    );
  }

  private async handleToolCall(toolCall: TypedToolCall<typeof tools>): Promise<void> {
    const toolFn = toolFunctions[toolCall.toolName];
    if (!toolFn) return this.handleUnknownToolCall(toolCall);

    try {
      console.log('Calling tool', toolCall.toolName, 'with input', toolCall.input);
      const toolResult = await toolFn(this.logsFileNumber, toolCall.input);
      this.addToMemory(toolCall.toolCallId, toolCall.toolName, toolResult);
    } catch (error) {
      this.handleToolCallError(error, toolCall);
    }
  }

  /* We could have passed the tools with their function logic directly to the model and let it all run independently,
  but then we would lose control of the ability to easily trace and log the flow, which makes debugging harder */
  async run(): Promise<string> {
    while (this.step < MAX_STEPS) {
      const result = await generateText({
        model: google('gemini-2.5-flash'),
        messages: this.agentMemory,
        tools,
        temperature: 0.1,
      });

      deepDelete(result.response.messages, 'providerOptions'); // Remove providerOptions to avoid cluttering the memory with the thoughtSignature
      this.agentMemory.push(...result.response.messages);

      if (result.finishReason === 'tool-calls') {
        for (const toolCall of result.toolCalls) {
          await this.handleToolCall(toolCall);
        }
      } else {
        return result.text;
      }

      this.step++;
      await sleep(1_000);
    }

    return chalk.red.bold.bgWhiteBright('Agent reached maximum steps without completing the task.');
  }
}
