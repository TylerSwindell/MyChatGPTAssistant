import Logger from "ts-logger-node";
import runAssistant from "./assistant/main";
import initialize from "./initialize";

(async () => {
  Logger.print("RUNNING", "GENERAL");

  initialize();
  runAssistant();
})();
