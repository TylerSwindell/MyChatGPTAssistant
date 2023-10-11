import { ChatCompletionMessageParam } from "openai/resources/chat";

type ChatSession = {
  initial: {
    run: boolean;
    message: string;
  };
  messages: ChatCompletionMessageParam[];
};

export const currentSession: ChatSession = {
  initial: {
    run: true,
    message: "\nHello!\nWhat is your name and how can I help you?",
  },
  messages: [],
};
