'use strict';
import {Client, ClientOptions, Guild, GuildMember, TextChannel} from 'discord.js';
import CF from './ConsoleFormatter';

class ClientHandler extends Client {
    constructor(options = {}) {
        super(<ClientOptions>options);

        if (!process.env.TOKEN)
            throw new Error('Invalid Token Provided');
        super.login(process.env.TOKEN).then(() =>
            CF.logEvent(`Logged in as ${super.user?.tag}`, 'INFO'));
    }



    async banUserByAvatar(avatarHash: string): Promise<undefined | boolean> {
        const guild: Guild | undefined = this.guilds.cache.get(process.env.GUILD_ID!);

        if (!guild) {
            CF.logEvent(`${process.env.GUILD_ID} does not exist or has been deleted`, 'ERROR');
            return false;
        }

        const user: GuildMember | undefined = guild?.members.cache.find(u => u.user.avatar === avatarHash);

        if (user?.bannable) {
            await user.ban({ reason: 'Trashed by Recycle BAN!!!', deleteMessageSeconds: 604800 });

            const channel = process.env.CHANNEL_ID &&
                guild.channels.cache.get(process.env.CHANNEL_ID) as TextChannel;

            if (channel)
                await channel.send(`:recycle: ${user} has been Trashed :wastebasket: by **Recycle BAN!**`);
            else if (process.env.CHANNEL_ID) {
                CF.logEvent(`${process.env.CHANNEL_ID} does not exist or has been deleted`, 'ERROR');
                return false;
            }
        }

        return !!user?.bannable;
    }
}

export default ClientHandler