import * as readline from "readline";
import { gptQuery, safeShutdown } from "../assistant/utilities";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

const yesOrNo = (prompt: string, cb: Function) =>
  rl.question(`${prompt} Y/n: `, (userAnswer: string) =>
    cb(userAnswer.toLowerCase() === "y" ? true : false)
  );

export const query = () => {
  (function loop() {
    rl.question("\nYou: ", async (q: string) => {
      if (q.toLowerCase() !== "x") {
        await gptQuery(q, { print: true });
        loop();
      } else safeShutdown();
    });
  })();
};

export const multipleChoice = () => {};

export default {
  yesOrNo,
  readline: rl,
};
