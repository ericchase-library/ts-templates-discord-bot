function getVariable(key: string) {
  if (process.env[key] === undefined || process.env[key] === '') {
    throw new Error(`.env '${key}' is undefined`);
  }
  return process.env[key];
}

export function getBotToken() {
  return getVariable('BOT_TOKEN');
}
export function getClientID() {
  return getVariable('CLIENT_ID');
}
export function getGuildID() {
  return getVariable('GUILD_ID');
}
export function getMongoDBUrl() {
  return getVariable('MONGODBURL');
}
