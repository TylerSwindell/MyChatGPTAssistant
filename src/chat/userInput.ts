import * as rl from "readline";

const readline = rl.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

const yesOrNo = async (prompt: string, cb: Function) =>
  readline.question(`${prompt} Y/n: `, (userAnswer: string) =>
    cb(userAnswer.toLowerCase() === "y" ? true : false)
  );

export default {
  yesOrNo,
  readline,
};
