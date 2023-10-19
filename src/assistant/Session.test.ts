import { describe, it, expect } from "vitest";
import { saveSession, generateSession, deleteSession } from "./Session.class";
import { ChatLog } from "./@types";
import { randomUUID } from "crypto";

describe("Assistant Object", () => {
  const myAssistant = generateSession();

  it("Should contain 1 message.", () => {
    expect(myAssistant.chatLength()).toBe(1);
  });

  const startDate = Date.now();
  const newAssistant = generateSession({
    title: "Hello",
    id: randomUUID(),
    startDate,
    fileName: "Hello-" + startDate,
    messages: [{ role: "assistant", content: "I am a robot." }],
  });

  it("Should only contain a single message which states 'I am a robot.'", () =>
    expect(newAssistant.getMessage(0)).toBe("I am a robot."));

  it("Should only contain one message.", () =>
    expect(newAssistant.chatLength()).toBe(1));

  it("Should be asked a question and store it in messages which would increase the chatLength.", () => {
    newAssistant.ask("Who are you?");
    expect(newAssistant.chatLength()).toBe(2);
  });

  it("Should be asking 'Who are you?'", () => {
    console.log(newAssistant.getMessages());
    expect(newAssistant.getMessage(1)).toBe("Who are you?");
  });

  it(
    "Should save the newAssistant session: " + newAssistant.getFileName(),
    () => expect(saveSession(newAssistant)).toBe(true)
  );

  it(
    "Should delete of newAssistant session: " + newAssistant.getFileName(),
    () => expect(deleteSession(newAssistant)).toBe(true)
  );

  it("Should only contain a single item.", () =>
    expect(generateSession().getMessage(0)).toBe(
      "\nHello!\nWhat is your name and how can I help you?"
    ));
});
