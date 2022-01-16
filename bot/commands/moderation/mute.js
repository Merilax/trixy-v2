const db = require('../../DB/sequelDB.js');
const masterIDs = require('../../masterIDs.json');

module.exports.commanddata = {
  name: "mute",
  category: "moderation",
  cooldown: 2,
  args: true,
  guildOnly: true
};

module.exports.run = async (
  bot,
  message,
  args,
  prefix
) => {
  if (!message.member.hasPermission("MANAGE_ROLES"))
    return message.channel.send(
      "<:delete:614100269369655306> You do not have permissions to manage roles or members."
    );

  let muteUser = args[0].slice(3,-1);
  if (!message.guild.members.cache.find(m => m.id === muteUser)) {
    return message.channel.send(
      "<:quote:614100269386432526> First, mention the user to mute."
    )
  } else {
    muteUser = message.guild.members.cache.find(m => m.id === muteUser);
  }
  if (muteUser.id === masterIDs.txdev) return;

  if (muteUser.id === message.author.id)
    return message.channel.send("Your voice isn't that annoying.");
  if (muteUser.roles.highest.position >= message.member.roles.highest.position) {
    return message.channel.send(
      "<:delete:614100269369655306> You cannot mute members with the same or higher role as yours."
    );
  }

  //const [mutes, created] = 

  let self = message.guild.members.cache.find(m => m.id === bot.user.id);
  let txMuteRole = message.guild.roles.cache.find(r => r.name === "Trixy Mute");
  if (!txMuteRole) {
    try {
      txMuteRole = await message.guild.roles.create({
        data: {
          name: "Trixy Mute",
          color: "#000001",
          position: self.roles.highest.position - 1
        }
      });

      message.guild.channels.cache.forEach(async (channel, id) => {
        await channel.updateOverwrite(txMuteRole, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false
        });
      });
      message.channel.send("<:fix:614100269449347082> I have created a Mute role, please check if its position is correct and working. Please do not change its name or I won't find it!");
    } catch (e) {
      console.log(e);
      return message.channel.send("<:delete:614100269369655306> Could not create Mute role! Am I administrator?");
    }
  }

  if (muteUser.roles.cache.has(txMuteRole.id)) {
    return message.channel.send(
      "<:delete:614100269369655306> This user can't be any more silent."
    );
  }

  if (args[1] && (args[1] < 1000000) && (args[1] > 0)) {
    var muteExpire = Date.now() + (parseInt(args[1]) * 60000);
  } else {
    var muteExpire = 0;
  }

  try {
    await db.Mutes.findOrCreate({ where: { guildId: message.guild.id }, defaults: { userName: muteUser.user.tag, userId: muteUser.user.id, guildId: message.guild.id, duration: muteExpire } });
    await muteUser.roles.add(txMuteRole);
    message.channel.send(
      `<:approve:614100268891504661> User ${args[0]} has been succesfully muted for ${args[1]} minutes.`
    );
  } catch (e) {
    console.log(e);
  }
};