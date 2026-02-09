import { generateText, ModelMessage, TypedToolCall } from 'ai';
import { google } from '@ai-sdk/google';
import { LogEntry } from './types';
import { INITIAL_SYSTEM_PROMPT } from './prompt';
import { tools } from './tools/schemas';
import { toolFunctions } from './tools/registry';
import { deepDelete, sleep } from '../utils/general';

const MAX_STEPS = 10;

export class LogTriageAgent {
  private agentMemory: ModelMessage[];
  private logs: LogEntry[];

  constructor(logs: LogEntry[]) {
    this.logs = logs;
    this.agentMemory = [
      {
        role: 'system',
        content: INITIAL_SYSTEM_PROMPT,
      }
    ];
  }

  private addToMemory(toolCallId: string, toolName: string, result: any): void {
    this.agentMemory.push({
      role: 'tool',
      content: [
        {
          type: 'tool-result',
          toolCallId,
          toolName,
          output: { type: 'json' as const, value: JSON.stringify(result) },
        },
      ],
    });
  }

  private async handleToolCall(toolCall: TypedToolCall<typeof tools>): Promise<void> {
    const toolFn = toolFunctions[toolCall.toolName];

    if (!toolFn) {
      this.addToMemory(
        toolCall.toolCallId,
        toolCall.toolName,
        { error: `Unknown tool: ${toolCall.toolName}` }
      );
      return;
    }

    try {
      console.log('Calling tool', toolCall.toolName, 'with input', toolCall.input);
      // Pass the visible logs to the tool
      const toolResult = await toolFn(this.logs, toolCall.input);
      this.addToMemory(toolCall.toolCallId, toolCall.toolName, toolResult);
    } catch (error) {
      this.addToMemory(
        toolCall.toolCallId,
        toolCall.toolName,
        { error: error instanceof Error ? error.message : 'Tool execution failed' }
      );
    }
  }

  async run(): Promise<string> {
    // Initial user message with the logs
    this.agentMemory.push({
      role: 'user',
      content: `Here are the latest logs:\n${JSON.stringify(this.logs, null, 2)}\n\nPlease analyze them and take necessary action.`,
    });

    let step = 0;
    while (step < MAX_STEPS) {
      let result;
      try {
        result = await generateText({
          model: google('gemini-2.5-flash'),
          messages: this.agentMemory,
          tools,
          temperature: 0.1,
        });
      } catch (error) {
        console.error("GenerateText Error Details:", JSON.stringify(error, null, 2));
        throw error;
      }

      // Remove providerOptions to keep memory clean
      deepDelete(result.response.messages, 'providerOptions');
      this.agentMemory.push(...result.response.messages);

      if (result.finishReason === 'tool-calls') {
        for (const toolCall of result.toolCalls) {
          await this.handleToolCall(toolCall);
        }
      } else {
        return result.text;
      }

      step++;
      await sleep(1_000); // polite delay
    }

    return 'Agent reached maximum steps without completing the investigation.';
  }
}
