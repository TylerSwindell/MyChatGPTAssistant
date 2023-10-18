import OpenAI from "openai";
import env from "dotenv";
import { ChatCompletionMessage } from "openai/resources/chat";

env.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const POST = async (
  messages: ChatCompletionMessage[]
): Promise<OpenAI.Chat.Completions.ChatCompletionMessage> => {
  const chatGPT = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
  });

  const chatGPTMessage = chatGPT.choices[0].message;

  return chatGPTMessage;
};
