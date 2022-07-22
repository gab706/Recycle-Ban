'use strict';
const Discord = require('discord.js');
const DotENV = require('dotenv');
const Recycle = require('./handlers/Recycle');
const MacOSBin = require('./handlers/MacOSBin');
const config = require('./settings/config.json');

const RecycleBotManager = new Recycle({
    intents: [
        Discord.IntentsBitField.Flags.Guilds,
        Discord.IntentsBitField.Flags.GuildMembers,
        Discord.IntentsBitField.Flags.GuildPresences
    ]
});
DotENV.config();

RecycleBotManager.start().then(() => console.log('Client Initiated'));

RecycleBotManager.once('ready', () => {
    const RecycleBinManager = new MacOSBin();

    setInterval(async() => {
        const activeFiles = [];
        for (const avatar of RecycleBinManager.cycleBin()) {
            const isUserBanned = await RecycleBotManager.banUserByAvatar(avatar.split('.')[0]);
            isUserBanned && activeFiles.push(avatar);
        }

        RecycleBinManager.deleteFiles(activeFiles);
    }, config.bin.check_interval * 1000);
});