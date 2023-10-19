import { describe, it, expect } from "vitest";
import fs from "fs";
describe("Whatever", () => {
  it("should pass CI", () => {
    expect(1).toBe(1);
  });
});

describe("File System testing and json imports.", () => {
  let sessionList: string[];
  const sessionChoice = 1;
  fs.readdir("./sessions", (err, files) => {
    sessionList = files;
  });

  it("should import a json file from the sessions folder", () => {
    const json = require(`../sessions/${sessionList[sessionChoice - 1]}`);
    console.log(json);
  });
});
