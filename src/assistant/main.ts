import Logger from "ts-logger-node";

import { gptQuery, initializeSession, safeShutdown } from "./utilities";

import * as readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

export function initializeAssistant(session?: string) {}

export default async function runAssistant() {
  // REWRITE COMPLETELY
  // try {
  //   const session = await initializeSession("session1697140143031");
  //   (function loop() {
  //     rl.question("\nYou: ", async (q: string) => {
  //       if (q.toLowerCase() !== "x") {
  //         await gptQuery(q, { print: true });
  //         loop();
  //       } else safeShutdown(session);
  //     });
  //   })();
  // } catch (err) {
  //   Logger.print(err as string, "ERROR");
  // }
}
