module.exports.registerEventHandlers = (client) => {
  // ========== Guild Create ==========
  client.on("guildCreate", (guild) => {
    console.log(`🆕 Joined new guild: ${guild.name} (${guild.id})`);
  });

  // ========== Guild Delete ==========
  client.on("guildDelete", (guild) => {
    console.log(`❌ Removed from guild: ${guild.name} (${guild.id})`);
  });

  // ========== Message Create ==========
  client.on("messageCreate", (message) => {
    if (message.author.bot) return;
    // Future: handle user messages
  });

  // ========== Message Delete ==========
  client.on("messageDelete", (message) => {
    // Future: handle message deletion
  });

  // ========== Message Update ==========
  client.on("messageUpdate", (oldMessage, newMessage) => {
    // Future: handle message edits
  });

  // ========== Guild Member Add ==========
  client.on("guildMemberAdd", (member) => {
    // Future: welcome message or logging
  });

  // ========== Guild Member Remove ==========
  client.on("guildMemberRemove", (member) => {
    // Future: farewell logging
  });

  // ========== Guild Member Update ==========
  client.on("guildMemberUpdate", (oldMember, newMember) => {
    // Future: role/nickname changes
  });

  // ========== Channel Create ==========
  client.on("channelCreate", (channel) => {
    // Future: log channel creation
  });

  // ========== Channel Delete ==========
  client.on("channelDelete", (channel) => {
    // Future: log channel deletion
  });

  // ========== Channel Update ==========
  client.on("channelUpdate", (oldChannel, newChannel) => {
    // Future: log channel updates
  });

  // ========== Message Reaction Add ==========
  client.on("messageReactionAdd", (reaction, user) => {
    // Future: handle reaction role or logging
  });

  // ========== Message Reaction Remove ==========
  client.on("messageReactionRemove", (reaction, user) => {
    // Future: handle reaction removal
  });

  // ========== Guild Update ==========
  client.on("guildUpdate", (oldGuild, newGuild) => {
    // Future: detect server setting changes
  });

  // ========== Voice State Update ==========
  client.on("voiceStateUpdate", (oldState, newState) => {
    // Future: join/leave voice, mute/unmute
  });

  client.on("voiceChannelJoin", (member, channel) => {
   console.log(`🔊 ${member.user.tag} joined voice channel: ${channel.name}`);
  });

  client.on("guildBoostAdd", (member) => {
   console.log(`🚀 ${member.user.tag} just boosted the server!`);
  });
};