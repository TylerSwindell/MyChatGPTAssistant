import * as readline from "readline";
import Logger, { textStyles } from "ts-logger-node";
import initialize from "./initialize";
import fs from "fs";
import Session, {
  generateSession,
  saveSession,
} from "./assistant/Session.class";

let currentSession: Session;
let sessionList: string[];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

const numberInput = (sessionChoice: number, loop: Function) => {
  Logger.print("Loading Session..", "GENERAL");

  const json = require(`../sessions/${sessionList[sessionChoice - 1]}`);

  currentSession = generateSession(json);
  Logger.print(
    ("\n" +
      currentSession.getMessage(currentSession.chatLength() - 1)) as string,
    "GENERAL",
    { style: textStyles.FgGreen }
  );

  loop();
};

const newSession = (): Session => {
  Logger.print("Starting a new session...", "GENERAL", {
    style: textStyles.FgGreen,
  });
  return generateSession();
};

const quitProgram = () => {
  Logger.print("Quiting...", "GENERAL", {
    style: textStyles.FgRed,
  });
  rl.close();
};

const stringInput = (sessionChoice: string, loop: Function) => {
  switch (sessionChoice.toLowerCase()) {
    case "x":
      quitProgram();
      break;
    case "n":
      currentSession = newSession();
      break;
    default:
      loop();
      break;
  }
};

const printMenu = (files: string[]) => {
  files.forEach((f, i) => {
    Logger.print(`${i + 1}: ${f}`, "GENERAL");
  });
  Logger.print("n: New Session", "GENERAL");
  Logger.print("x: Quit", "GENERAL");
};

async function menu() {
  fs.readdir("./sessions", (err, files) => {
    printMenu(files);
    sessionList = files;

    // REWRITE COMPLETELY ADD NEW SESSION OPTION
    (function loop() {
      if (!currentSession) {
        rl.question("\nPick a Session: ", async (sessionChoice: string) => {
          const parsedChoice = parseInt(sessionChoice);
          parsedChoice
            ? numberInput(parsedChoice, loop)
            : stringInput(sessionChoice, loop);
        });
      } else {
        rl.question("\nYou: ", (userInput) => {
          if (userInput[0] === "!") {
            switch (userInput) {
              case "!q":
                rl.close();
            }
          } else {
            currentSession.ask(userInput).then((res) => {
              Logger.print(res.content as string, "GENERAL", {
                style: textStyles.FgGreen,
              });
              saveSession(currentSession);
              loop();
            });
          }
        });
      }
    })();
  });
}

(async () => {
  Logger.print("RUNNING", "GENERAL");
  initialize();
  menu();
})();

// docker run -d --name MySQLServer -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=your_password' -p 1433:1433 mcr.microsoft.com/azure-sql-edge
