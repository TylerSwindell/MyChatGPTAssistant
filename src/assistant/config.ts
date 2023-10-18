import { ChatCompletionMessage } from "openai/resources";

const sessionConfig = {
  initial: [
    {
      role: "assistant",
      content: "\nHello!\nWhat is your name and how can I help you?",
    },
  ] as ChatCompletionMessage[],
  saveFolder: "./sessions/",
  title: "session",
};

export default sessionConfig;
