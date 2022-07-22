'use strict';
const { Client } = require('discord.js');
const MacOSBin = require('./MacOSBin');
const config = require('../settings/config.json');

class Recycle extends Client {
    constructor(options = {}) {
        super(options);
    }

    async start() {
        if (process.env.TOKEN && process.env.TOKEN === '')
            throw new Error('Token not defined, please define in .env');
        await super.login(process.env.TOKEN);
    }

    async banUserByAvatar(avatar) {
        const guild = this.guilds.cache.get(config.guild.id),
            channel = guild.channels.cache.get(config.guild.channel),
            user = guild.members.cache.find(u => u.user.avatar === avatar);
        if (user && user.bannable) {
            await user.ban({ reason: 'Trashed by Recycle BAN!!!', deleteMessageDays: 7 });
            if (channel.type === 0)
                await channel.send(`:recycle: ${user} has been Trashed :wastebasket: by **Recycle BAN!** `);
        }

        return (user && user.bannable);
    }
}

module.exports = Recycle;