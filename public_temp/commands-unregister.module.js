// src/lib/env.ts
function getVariable(key) {
  if (process.env[key] === undefined || process.env[key] === "") {
    throw new Error(`.env '${key}' is undefined`);
  }
  return process.env[key];
}
function getBotToken() {
  return getVariable("BOT_TOKEN");
}

// src/commands-unregister.module.ts
import { REST, Routes } from "src/discord/discord.module.js";
var rest = new REST({ version: "10" }).setToken(getBotToken());
