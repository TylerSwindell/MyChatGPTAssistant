import { UUID } from "crypto";
import { ChatCompletionMessage } from "openai/resources/chat";

export type SessionLog = {
  title: string;
  startDate: number;
  id: UUID;
  fileName: string;
  messages: ChatCompletionMessage[];
};

export type ChatRoles = "function" | "user" | "system" | "assistant";
