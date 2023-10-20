import * as readline from "readline";
import Logger, { textStyles } from "ts-logger-node";
import initialize from "./initialize";
import fs from "fs";
import Session, {
  generateSession,
  saveSession,
} from "./assistant/Session.class";

const sessionInfo: {
  currentSession: Session | undefined;
  sessionList: string[];
} = {
  currentSession: undefined,
  sessionList: [],
};

const menuOptions = {
  quit: {
    menu: {
      symbol: "x",
      text: "Quit",
    },
    chat: {
      symbol: "!q",
      text: "Quit",
    },
  },
  new: {
    symbol: "n",
    text: "New",
  },
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

const numberInput = (sessionChoice: number, loop: Function) => {
  Logger.print("Loading Session..", "GENERAL");

  const json = require(`../sessions/${
    sessionInfo.sessionList[sessionChoice - 1]
  }`);

  sessionInfo.currentSession = generateSession(json);
  Logger.print(
    ("\n" +
      sessionInfo.currentSession.getMessage(
        sessionInfo.currentSession.chatLength() - 1
      )) as string,
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
    case menuOptions.quit.menu.symbol:
      quitProgram();
      break;
    case menuOptions.new.symbol:
      sessionInfo.currentSession = newSession();
      menu();
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
  Logger.print(`${menuOptions.new.symbol}: ${menuOptions.new.text}`, "GENERAL");
  Logger.print(
    `${menuOptions.quit.menu.symbol}: ${menuOptions.quit.menu.text}`,
    "GENERAL"
  );
};

async function menu() {
  fs.readdir("./sessions", (err, files) => {
    sessionInfo.sessionList = files;

    // REWRITE COMPLETELY ADD NEW SESSION OPTION
    (function loop() {
      if (!sessionInfo.currentSession) {
        printMenu(files);
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
              case menuOptions.quit.chat.symbol:
                rl.close();
            }
          } else if (sessionInfo.currentSession) {
            sessionInfo.currentSession.ask(userInput).then((res) => {
              Logger.print(res.content as string, "GENERAL", {
                style: textStyles.FgGreen,
              });
              try {
                if (sessionInfo.currentSession)
                  saveSession(sessionInfo.currentSession);
                else
                  throw new Error(
                    "Error saving session. Undefined session info."
                  );
                loop();
              } catch (err) {
                Logger.print(err as string, "ERROR");
              }
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
