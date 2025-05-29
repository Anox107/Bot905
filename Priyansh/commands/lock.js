const fs = require("fs");
const path = __dirname + "/lockdata.json";

module.exports.config = {
  name: "lock",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭 + Modified by ChatGPT",
  description: "Lock group name and nicknames (only bot/owner can change)",
  commandCategory: "Box Chat",
  usages: "[name]",
  cooldowns: 3
};

module.exports.run = async function({ api, event, args }) {
  const ownerID = "100082811408144"; // Your UID
  const botID = api.getCurrentUserID();
  const threadID = event.threadID;
  const name = args.join(" ");

  if (!name) return api.sendMessage("⚠️ Please provide a nickname/group name to lock.", threadID);
  if (event.senderID !== ownerID) return api.sendMessage("❌ Only the owner can use this command.", threadID);

  const threadInfo = await api.getThreadInfo(threadID);
  const idtv = threadInfo.participantIDs;

  // Set nicknames
  for (let userID of idtv) {
    await new Promise(r => setTimeout(r, 3000));
    api.changeNickname(name, threadID, userID);
  }

  // Set group name
  api.setTitle(name, threadID, (err) => {
    if (err) return api.sendMessage("❌ Failed to change group name.", threadID);

    // Save lock data
    const data = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : {};
    data[threadID] = {
      nickname: name,
      groupName: name,
      lock: true
    };
    fs.writeFileSync(path, JSON.stringify(data, null, 2));

    return api.sendMessage(`✅ All nicknames and group name set to "${name}" and locked.`, threadID);
  });
};
