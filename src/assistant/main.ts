import Logger from "ts-logger-node";
import * as readline from "readline";
import { POST } from "../gpt/post";
import { writeFileSync } from "fs";
import { currentSession } from "./session";
import { ChatCompletionMessage } from "openai/resources/chat";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function gptQuery(
  queryText: string,
  role?: "function" | "user" | "system" | "assistant"
): Promise<ChatCompletionMessage> {
  currentSession.messages.push({ role: role ?? "user", content: queryText });

  const postRes = await POST(currentSession.messages);
  currentSession.messages.push(postRes);
  return postRes;
}

async function printQuery(queryText: string) {
  console.log((await gptQuery(queryText)).content);
}

function safeShutdown() {
  writeFileSync(
    "./sessions/poop.json",
    JSON.stringify(currentSession.messages)
  );
  rl.close();
}

export default function runAssistant() {
  try {
    (function loop() {
      if (currentSession.initial.run) {
        console.log(currentSession.initial.message);
        currentSession.messages.push({
          role: "assistant",
          content: currentSession.initial.message,
        });
        currentSession.initial.run = false;
      }

      rl.question("\nYou: ", async (q: string) => {
        if (q.toLowerCase() !== "x") {
          await printQuery(q);
          loop();
        } else safeShutdown();
      });
    })();
  } catch (err) {
    Logger.print(err as string, "ERROR");
  }
}
