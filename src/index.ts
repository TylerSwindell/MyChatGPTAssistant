import userInput from "./chat/userInput";
import Logger, { textStyles } from "ts-logger-node";
import initialize from "./initialize";
import fs from "fs";
import Session from "./Session/Session.class";
import {
  createSession,
  isSessionLoaded,
  loadSession,
  saveSession,
} from "./Session/helper";
import { menuOptions } from "./menuConfig";
import { safeShutdown } from "./Session/utilities";
import { ChatCompletionMessage } from "openai/resources";

const { readline } = userInput;

const sessionInfo: {
  currentSession: Session | undefined;
  sessionList: string[];
  sessionLoaded: boolean;
} = {
  currentSession: undefined,
  sessionList: [],
  sessionLoaded: false,
};

const logContent = (msg: ChatCompletionMessage) => {
  Logger.print(msg.content as string, "GENERAL", {
    style: textStyles.FgGreen,
  });
};

const getCurrentSession = () =>
  isSessionLoaded(sessionInfo.currentSession)
    ? sessionInfo.currentSession
    : undefined;

const setCurrentSession = (session: Session) =>
  (sessionInfo.currentSession = session);

const numberInput = (sessionChoice: number, loop: Function) => {
  Logger.print("Loading Session..", "GENERAL");
  Logger.print("Enter '!q' to exit the chat.", "GENERAL", {
    style: textStyles.FgRed,
  });

  const json = require(`../sessions/${
    sessionInfo.sessionList[sessionChoice - 1]
  }`);

  setCurrentSession(loadSession(json));
  Logger.print(
    ("\n" +
      getCurrentSession()?.getMessage(
        getCurrentSession()?.chatLength() ?? 1 - 1
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
  return createSession();
};

const quitProgram = () => {
  Logger.print("Quiting...", "GENERAL", {
    style: textStyles.FgRed,
  });
  readline.close();
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

const isCommand = (command: string) => command[0] === "!";

const handleCommandInput = (userInput: string, loop: Function) => {
  switch (userInput) {
    case menuOptions.quit.chat.symbol:
      if (sessionInfo.currentSession) safeShutdown(sessionInfo.currentSession);
      else readline.close();
      break;
    default:
      Logger.print(
        "Invalid command: ! is used for commands such as '!q' to quit the chat session.",
        "ERROR"
      );
      loop();
      break;
  }
};

async function menu() {
  fs.readdir("./sessions", (err, files) => {
    sessionInfo.sessionList = files;

    // REWRITE COMPLETELY ADD NEW SESSION OPTION
    (function loop() {
      if (!sessionInfo.currentSession) {
        printMenu(files);
        readline.question(
          "\nPick a Session: ",
          async (sessionChoice: string) => {
            const parsedChoice = parseInt(sessionChoice);
            parsedChoice
              ? numberInput(parsedChoice, loop)
              : stringInput(sessionChoice, loop);
          }
        );
      } else {
        readline.question("\nYou: ", async (userInput) => {
          console.log();
          if (isCommand(userInput)) handleCommandInput(userInput, loop);
          else if (isSessionLoaded(sessionInfo.currentSession)) {
            try {
              await getCurrentSession()
                ?.ask(userInput)
                .then((res) => {
                  logContent(res);

                  try {
                    if (isSessionLoaded(sessionInfo.currentSession))
                      saveSession(sessionInfo?.currentSession);
                    else
                      throw new Error(
                        "Error saving session. Undefined session info."
                      );
                    loop();
                  } catch (err) {
                    Logger.print(err as string, "ERROR");
                  }
                });
            } catch (err) {
              Logger.print(err as string, "ERROR");
            }
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
