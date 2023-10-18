import * as readline from "readline";
import Logger, { textStyles } from "ts-logger-node";
import initialize from "./initialize";
import fs from "fs";
import userInput from "./chat/userInput";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

const numberInput = () => {
  userInput.yesOrNo("Is this the correct session?", (correctSession: boolean) =>
    correctSession ? Logger.print("Loading Session..", "GENERAL") : menu()
  );
};

const stringInput = (sessionChoice: string, loop: Function) => {
  switch (sessionChoice.toLowerCase()) {
    case "x":
      Logger.print("Quiting...", "GENERAL", {
        style: textStyles.FgRed,
      });
      rl.close();
      break;
    case "n":
      Logger.print("Starting a new session...", "GENERAL", {
        style: textStyles.FgGreen,
      });
    default:
      loop();
  }
};

const printMenu = (files: string[]) => {
  files.forEach((f, i) => {
    Logger.print(`${i}: ${f}`, "GENERAL");
  });
  Logger.print("n: New Session", "GENERAL");
  Logger.print("x: Quit", "GENERAL");
};

function menu() {
  fs.readdir("./sessions", (err, files) => {
    printMenu(files);

    // REWRITE COMPLETELY ADD NEW SESSION OPTION
    (function loop() {
      rl.question("\nPick a Session: ", async (sessionChoice: string) =>
        parseInt(sessionChoice)
          ? numberInput()
          : stringInput(sessionChoice, loop)
      );
    })();
  });
}

(async () => {
  Logger.print("RUNNING", "GENERAL");
  initialize();
  menu();
})();

// docker run -d --name MySQLServer -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=your_password' -p 1433:1433 mcr.microsoft.com/azure-sql-edge
