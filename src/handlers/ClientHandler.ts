'use strict';
import Discord from 'discord.js';
import notifier from 'node-notifier';
import { lookup } from 'dns';
import CF from './ConsoleFormatter.js';

class ClientHandler extends Discord.Client {
    public guild: Discord.Guild | null = null;
    public channel: Discord.TextChannel | null | undefined = null;

    constructor() {
        super({
            intents: [
                Discord.IntentsBitField.Flags.Guilds,
                Discord.IntentsBitField.Flags.GuildMembers
            ]
        });
    }

    public checkOnline(): Promise<void> {
        return new Promise((y, n) => {
            lookup('google.com', (error) => {
                if (error) n();
                else y();
            });
        });
    }

    public setToken(token: string): Promise<string> {
        return super.login(token);
    }

    public async setGuildID(id: string): Promise<Discord.Guild | null> {
        this.guild = await this.guilds.fetch(id);
        return this.guild;
    }

    public async setChannelID(id: string): Promise<Discord.TextChannel | null | undefined> {
        this.channel = await this.guild?.channels.fetch(id) as Discord.TextChannel;
        return this.channel;
    }

    public async banUserByAvatar(avatarHash: string): Promise<void> {
        if (!this.guild) {
            this.logEvent(`${this.guild} does not exist or has been deleted`, 'error', true);
            process.exit(1);
        }

        await this.guild.members.fetch();

        const user: Discord.GuildMember | undefined =
            this.guild.members.cache.find(u => u.user.avatar === avatarHash);

        if (user && user?.bannable) {
            await user.ban({ reason: 'Trashed by Recycle BAN!!!', deleteMessageSeconds: 604800 });
            this.logEvent('info', `${user.user.tag} has been banned`, true);

            if (this.channel)
                await this.channel.send(`:recycle: ${user} has been Trashed :wastebasket: by **Recycle BAN!**`);
            else if (this.channel)
                this.logEvent(`${this.channel} does not exist or has been deleted`, 'error', true);
        } else if (!user?.bannable)
            this.logEvent(`${user?.user.tag} cannot be banned`, 'error', true);
        else if (!user)
            this.logEvent(`${avatarHash} did not point to a user`, 'error', true);
    }

    public logEvent(text: string, eventType: string, computerWide: boolean): void {
        const formattedTimestamp = CF.colourise(new Date().toLocaleTimeString(), 'yellow');
        const eventColor = { 'INFO': 'cyan', 'ERROR': 'red', 'WARNING': 'yellow' }[eventType.toUpperCase()] || 'white';
        const formattedEventType = CF.colourise(eventType, eventColor, ['bold']);
        const formattedMessage = CF.colourise(text, 'white');
        console.log(`${formattedTimestamp} ${formattedEventType}: ${formattedMessage}`);
        computerWide && notifier.notify({
            title: 'RecycleBan',
            message: text,
            sound: true
        });
    }
}

export default ClientHandler;