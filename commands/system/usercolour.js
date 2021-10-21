const db = require('../../DB/sequelDB.js');
const PersonalCard = require('../../DB/modals/PersonalCard');

module.exports.commanddata = {
    name: "usercolour",
    aliases: ['colour'],
    category: "system",
    cooldown: 10,
    guildOnly: false,
    args: true
};

module.exports.run = async (
    bot,
    message,
    args,
    prefix
) => {
    const [xpenable, xpCreated] = await db.XPEnabled.findOrCreate({ where: { guild: message.guild.id }, defaults: { guild: message.guild.id } });
    if (xpenable.enabled === false) { return }

    const newColour = args[0].trim().toLowerCase();
    if (newColour.match(/^#[0-9a-f]{3,6}$/i) === false) return message.channel.send("<:delete:614100269369655306> Colour must be in hexadecimal format.");

    try {
        if (userColor) {
            await PersonalCard.findOneAndUpdate({ discordId: message.author.id }, { color: newColour });
        } else {
            await PersonalCard.create({
                discordId: message.author.id,
                color: newColour
            });
        }
    } catch (err) {
        console.log(err);
        message.channel.send("<:delete:614100269369655306> Something went wrong...");
    }

    message.channel.send("<:approve:614100268891504661> Success!");
};