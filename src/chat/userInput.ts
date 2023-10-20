import * as readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

const yesOrNo = (prompt: string, cb: Function) =>
  rl.question(`${prompt} Y/n: `, (userAnswer: string) =>
    cb(userAnswer.toLowerCase() === "y" ? true : false)
  );

export default {
  yesOrNo,
  readline: rl,
};
