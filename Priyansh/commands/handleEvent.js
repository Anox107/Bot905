const fs = require("fs");
const path = __dirname + "/commands/lockdata.json";

module.exports = async function ({ api, event }) {
  const threadID = event.threadID;
  const authorID = event.author;
  const botID = api.getCurrentUserID();
  const data = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : {};
  const lock = data[threadID];

  if (!lock || !lock.lock) return;

  const ownerID = "100082811408144";

  // Block nickname changes by others
  if (event.type === "change_nickname") {
    if (authorID !== botID && authorID !== ownerID) {
      const targetID = event.nicknameChange.userID;
      api.changeNickname(lock.nickname, threadID, targetID);
    }
  }

  // Block group name changes by others
  if (event.type === "change_thread_name") {
    if (authorID !== botID && authorID !== ownerID) {
      api.setTitle(lock.groupName, threadID);
    }
  }
};
