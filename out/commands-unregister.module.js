// @bun
// src/commands-unregister.module.ts
import { REST, Routes } from "./external/discord/discord.module.js";

// src/lib/lib.env.ts
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
var rest = new REST({ version: "10" }).setToken(getBotToken());

//# debugId=5A54A39208ED3A5B64756E2164756E21
//# sourceMappingURL=commands-unregister.module.js.map
